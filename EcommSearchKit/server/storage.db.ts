import { 
  users, 
  containers, 
  leases, 
  favorites, 
  memberships,
  depotLocations,
  type User,
  type InsertUser,
  type Container,
  type InsertContainer,
  type Lease,
  type InsertLease,
  type Favorite,
  type InsertFavorite,
  type Membership,
  type InsertMembership,
  type DepotLocation,
  type InsertDepotLocation
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, or, gte, lte, desc, asc, inArray, isNull, sql } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser || undefined;
  }

  // Container operations
  async getContainer(id: number): Promise<Container | undefined> {
    const [container] = await db.select().from(containers).where(eq(containers.id, id));
    return container || undefined;
  }

  async getContainers(params: {
    page?: number;
    limit?: number;
    type?: string[];
    condition?: string[];
    region?: string;
    city?: string;
    postalCode?: string;
    priceMin?: number;
    priceMax?: number;
    query?: string;
    sortBy?: string;
    depotId?: number;
    latitude?: number;
    longitude?: number;
    radiusMiles?: number;
  }): Promise<{ containers: Container[]; totalResults: number; totalPages: number }> {
    try {
      // Default values
      const page = params.page || 1;
      const limit = params.limit || 10;
      const offset = (page - 1) * limit;
      
      // Build query conditions
      const conditions = [];
      
      if (params.type && params.type.length > 0) {
        // Build type condition with more flexible matching
        const typeConditions = params.type.map(typeId => {
          // For each type ID, we'll do a more relaxed search
          // This allows for more flexible matching with container types
          return or(
            like(containers.type, `${typeId}%`),   // Starts with the type
            like(containers.type, `%${typeId}%`),  // Contains the type
            like(containers.name, `${typeId}%`),   // Name starts with the type 
            like(containers.name, `%${typeId}%`)   // Name contains the type
          );
        });
        
        if (typeConditions.length > 0) {
          conditions.push(or(...typeConditions));
          console.log(`Filtering by types (flexible matching): ${params.type.join(', ')}`);
        }
      }
      
      if (params.condition && params.condition.length > 0) {
        conditions.push(inArray(containers.condition, params.condition));
        console.log(`Filtering by conditions: ${params.condition.join(', ')}`);
      }
      
      // Ensure region filtering works properly
      if (params.region && params.region !== 'all' && params.region !== '') {
        console.log(`Filtering by region: ${params.region}`);
        conditions.push(eq(containers.region, params.region));
      } else {
        console.log('No region filter applied - showing all regions');
      }
      
      // Enhanced city filtering - case insensitive match
      if (params.city && params.city.trim() !== '') {
        console.log(`Filtering by city: ${params.city}`);
        conditions.push(like(containers.city, `%${params.city.trim()}%`));
      }
      
      // Postal code filtering
      if (params.postalCode && params.postalCode.trim() !== '') {
        console.log(`Filtering by postal code: ${params.postalCode}`);
        // More flexible postal code matching with fallback to location/city search
        conditions.push(
          or(
            like(containers.postalCode, `%${params.postalCode.trim()}%`),
            // If searching by postal code but using radius, allow city & region matching too
            params.latitude && params.longitude ? like(containers.city, `%${params.postalCode.trim()}%`) : undefined,
            params.latitude && params.longitude ? like(containers.region, `%${params.postalCode.trim()}%`) : undefined
          )
        );
      }
      
      if (params.priceMin !== undefined) {
        conditions.push(gte(containers.price, params.priceMin.toString()));
      }
      
      if (params.priceMax !== undefined) {
        conditions.push(lte(containers.price, params.priceMax.toString()));
      }
      
      if (params.depotId) {
        conditions.push(eq(containers.depotId, params.depotId));
      }
      
      if (params.query) {
        conditions.push(
          or(
            like(containers.name, `%${params.query}%`),
            like(containers.location, `%${params.query}%`),
            like(containers.type, `%${params.query}%`),
            like(containers.condition, `%${params.query}%`)
          )
        );
      }
      
      // If we have location coordinates and radius, we need to do a join
      // with depot_locations and calculate distance using the Haversine formula
      let queryBuilder;
      let countQueryBuilder;
      
      if (params.latitude !== undefined && params.longitude !== undefined && params.radiusMiles !== undefined) {
        console.log(`Starting spatial search with lat: ${params.latitude}, lng: ${params.longitude}, radius: ${params.radiusMiles} miles`);
        
        // Using SQL's built-in functions to calculate distance with the Haversine formula
        // This calculates distance in miles between two points using their latitude and longitude
        const haversineFormula = sql`
          3959 * acos(
            cos(radians(${params.latitude})) * 
            cos(radians(${depotLocations.latitude})) * 
            cos(radians(${depotLocations.longitude}) - radians(${params.longitude})) + 
            sin(radians(${params.latitude})) * 
            sin(radians(${depotLocations.latitude}))
          )
        `;
        
        // Log the conditions for debugging
        console.log('Current search conditions count:', conditions.length);
        
        // For location searches, be a bit more lenient with conditions if we have very specific constraints
        if (conditions.length > 2) {
          console.log('Multiple search conditions detected in location search - results may be limited');
        }
        
        // Query for containers with depot location join and distance calculation
        queryBuilder = db
          .select({
            id: containers.id,
            name: containers.name,
            type: containers.type,
            condition: containers.condition,
            price: containers.price,
            region: containers.region,
            city: containers.city,
            location: containers.location,
            depotId: containers.depotId,
            image: containers.image,
            sku: containers.sku,
            wooProductId: containers.wooProductId,
            shipping: containers.shipping,
            availableImmediately: containers.availableImmediately,
            leaseAvailable: containers.leaseAvailable,
            createdAt: containers.createdAt,
            updatedAt: containers.updatedAt,
            distance: haversineFormula.as('distance')
          })
          .from(containers)
          .innerJoin(depotLocations, eq(containers.depotId, depotLocations.id))
          .where(and(
            ...conditions,
            sql`${haversineFormula} <= ${params.radiusMiles}`
          ));
          
        // Query for total count
        countQueryBuilder = db
          .select({ count: sql<number>`count(*)` })
          .from(containers)
          .innerJoin(depotLocations, eq(containers.depotId, depotLocations.id))
          .where(and(
            ...conditions,
            sql`${haversineFormula} <= ${params.radiusMiles}`
          ));
      } else {
        // Standard query without location filtering
        queryBuilder = db
          .select()
          .from(containers)
          .where(conditions.length > 0 ? and(...conditions) : undefined);
        
        // Standard count query
        countQueryBuilder = db
          .select({ count: sql<number>`count(*)` })
          .from(containers)
          .where(conditions.length > 0 ? and(...conditions) : undefined);
      }
      
      // Get total count for pagination
      const [countResult] = await countQueryBuilder;
      let totalCount = Number(countResult.count);
      let totalPages = Math.ceil(totalCount / limit);
      
      // If we have location search but no results found, try a more relaxed search
      if (totalCount === 0 && params.latitude !== undefined && params.longitude !== undefined && params.radiusMiles) {
        console.log('No results found with current filters. Trying relaxed search...');
        
        // Create a more relaxed haversine formula with a larger radius
        const relaxedHaversineFormula = sql`
          3959 * acos(
            cos(radians(${params.latitude})) * 
            cos(radians(${depotLocations.latitude})) * 
            cos(radians(${depotLocations.longitude}) - radians(${params.longitude})) + 
            sin(radians(${params.latitude})) * 
            sin(radians(${depotLocations.latitude}))
          )
        `;
        
        // Use a much larger radius for comprehensive search
        const expandedRadius = 5000;
        
        // Relaxed query with minimal conditions - just keep the location filter
        const relaxedQueryBuilder = db
          .select({
            id: containers.id,
            name: containers.name,
            type: containers.type,
            condition: containers.condition,
            price: containers.price,
            region: containers.region,
            city: containers.city,
            location: containers.location,
            depotId: containers.depotId,
            image: containers.image,
            sku: containers.sku,
            wooProductId: containers.wooProductId,
            shipping: containers.shipping,
            availableImmediately: containers.availableImmediately,
            leaseAvailable: containers.leaseAvailable,
            createdAt: containers.createdAt,
            updatedAt: containers.updatedAt,
            distance: relaxedHaversineFormula.as('distance')
          })
          .from(containers)
          .innerJoin(depotLocations, eq(containers.depotId, depotLocations.id))
          .where(sql`${relaxedHaversineFormula} <= ${expandedRadius}`);
        
        const relaxedCountQueryBuilder = db
          .select({ count: sql<number>`count(*)` })
          .from(containers)
          .innerJoin(depotLocations, eq(containers.depotId, depotLocations.id))
          .where(sql`${relaxedHaversineFormula} <= ${expandedRadius}`);
        
        const [relaxedCountResult] = await relaxedCountQueryBuilder;
        const relaxedTotalCount = Number(relaxedCountResult.count);
        
        if (relaxedTotalCount > 0) {
          console.log(`Found ${relaxedTotalCount} results with relaxed search at ${expandedRadius} miles radius.`);
          
          // First, get the closest depot location
          const closestDepotQuery = db
            .select({
              depotId: containers.depotId,
              distance: relaxedHaversineFormula.as('distance')
            })
            .from(containers)
            .innerJoin(depotLocations, eq(containers.depotId, depotLocations.id))
            .where(sql`${relaxedHaversineFormula} <= ${expandedRadius}`)
            .orderBy(asc(sql`distance`))
            .limit(1);
          
          const [closestDepot] = await closestDepotQuery;
          
          if (closestDepot) {
            console.log(`Showing containers only from closest depot: ${closestDepot.depotId} at ${closestDepot.distance} miles`);
            
            // Now get all containers from only the closest depot
            queryBuilder = db
              .select({
                id: containers.id,
                name: containers.name,
                type: containers.type,
                condition: containers.condition,
                price: containers.price,
                region: containers.region,
                city: containers.city,
                location: containers.location,
                depotId: containers.depotId,
                image: containers.image,
                sku: containers.sku,
                wooProductId: containers.wooProductId,
                shipping: containers.shipping,
                availableImmediately: containers.availableImmediately,
                leaseAvailable: containers.leaseAvailable,
                createdAt: containers.createdAt,
                updatedAt: containers.updatedAt,
                distance: relaxedHaversineFormula.as('distance')
              })
              .from(containers)
              .innerJoin(depotLocations, eq(containers.depotId, depotLocations.id))
              .where(eq(containers.depotId, closestDepot.depotId));
            
            // Count containers from closest depot only
            const closestDepotCountQuery = db
              .select({ count: sql<number>`count(*)` })
              .from(containers)
              .where(eq(containers.depotId, closestDepot.depotId));
            
            const [closestDepotCount] = await closestDepotCountQuery;
            totalCount = Number(closestDepotCount.count);
            totalPages = Math.ceil(totalCount / limit);
          } else {
            // Fallback to original relaxed query if no closest depot found
            queryBuilder = relaxedQueryBuilder;
            totalCount = relaxedTotalCount;
            totalPages = Math.ceil(relaxedTotalCount / limit);
          }
        }
      }
      
      // Add sorting - prioritize distance for location-based searches
      let orderBy;
      if (params.latitude !== undefined && params.longitude !== undefined) {
        // For location searches, always sort by distance first (closest locations)
        orderBy = asc(sql`distance`);
      } else if (params.sortBy) {
        switch (params.sortBy) {
          case 'price_asc':
            orderBy = asc(containers.price);
            break;
          case 'price_desc':
            orderBy = desc(containers.price);
            break;
          case 'newest':
            orderBy = desc(containers.createdAt);
            break;
          case 'distance':
            // Only applicable if we're using the location search
            if (params.latitude !== undefined && params.longitude !== undefined) {
              orderBy = asc(sql`distance`);
              break;
            }
            // Fall through to default if location search isn't being used
          default:
            orderBy = asc(containers.name);
        }
      } else {
        orderBy = asc(containers.name);
      }
      
      // Add pagination and sorting to the query
      const containerResults = await queryBuilder
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);
      
      // Extract just the container data for the result
      const containersData = containerResults.map((result: Record<string, any>) => {
        // If we joined with depotLocations and calculated distance, it will be mixed in with container fields
        // Need to extract just the container fields
        const container: Partial<Container> = {};
        for (const key in result) {
          if (key !== 'distance' && Object.prototype.hasOwnProperty.call(containers, key)) {
            container[key as keyof Container] = result[key];
          }
        }
        return container as Container;
      });
      
      return {
        containers: containersData,
        totalResults: totalCount,
        totalPages
      };
    } catch (error) {
      console.error('Error in getContainers:', error);
      throw error;
    }
  }

  async createContainer(insertContainer: InsertContainer): Promise<Container> {
    const [container] = await db.insert(containers).values(insertContainer).returning();
    return container;
  }

  async updateContainer(id: number, containerData: Partial<InsertContainer>): Promise<Container | undefined> {
    const [updatedContainer] = await db
      .update(containers)
      .set(containerData)
      .where(eq(containers.id, id))
      .returning();
    
    return updatedContainer || undefined;
  }

  async deleteContainer(id: number): Promise<boolean> {
    const result = await db.delete(containers).where(eq(containers.id, id)).returning({ id: containers.id });
    return result.length > 0;
  }

  // Lease operations
  async getLease(id: number): Promise<Lease | undefined> {
    const [lease] = await db.select().from(leases).where(eq(leases.id, id));
    return lease || undefined;
  }

  async getLeasesByUser(userId: number): Promise<Lease[]> {
    return await db.select().from(leases).where(eq(leases.userId, userId));
  }

  async createLease(insertLease: InsertLease): Promise<Lease> {
    const [lease] = await db.insert(leases).values(insertLease).returning();
    return lease;
  }

  async updateLease(id: number, leaseData: Partial<InsertLease>): Promise<Lease | undefined> {
    const [updatedLease] = await db
      .update(leases)
      .set(leaseData)
      .where(eq(leases.id, id))
      .returning();
    
    return updatedLease || undefined;
  }

  async deleteLease(id: number): Promise<boolean> {
    const result = await db.delete(leases).where(eq(leases.id, id)).returning({ id: leases.id });
    return result.length > 0;
  }
  
  async getLeaseReportData(): Promise<any[]> {
    try {
      // Fetch all leases with related user and container information
      const result = await db.query.leases.findMany({
        with: {
          user: true,
          container: {
            with: {
              depot: true
            }
          }
        },
        orderBy: [desc(leases.startDate)]
      });
      
      return result;
    } catch (error) {
      console.error("Error in getLeaseReportData:", error);
      return [];
    }
  }

  // Favorite operations
  async getFavorite(id: number): Promise<Favorite | undefined> {
    const [favorite] = await db.select().from(favorites).where(eq(favorites.id, id));
    return favorite || undefined;
  }

  async getFavoritesByUser(userId: number): Promise<Favorite[]> {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db.insert(favorites).values(insertFavorite).returning();
    return favorite;
  }

  async deleteFavorite(id: number): Promise<boolean> {
    const result = await db.delete(favorites).where(eq(favorites.id, id)).returning({ id: favorites.id });
    return result.length > 0;
  }

  // Membership operations
  async getMembership(id: number): Promise<Membership | undefined> {
    const [membership] = await db.select().from(memberships).where(eq(memberships.id, id));
    return membership || undefined;
  }

  async getMembershipByName(name: string): Promise<Membership | undefined> {
    const [membership] = await db.select().from(memberships).where(eq(memberships.name, name));
    return membership || undefined;
  }

  async getAllMemberships(): Promise<Membership[]> {
    return await db.select().from(memberships);
  }

  async createMembership(insertMembership: InsertMembership): Promise<Membership> {
    const [membership] = await db.insert(memberships).values(insertMembership).returning();
    return membership;
  }

  async updateMembership(id: number, membershipData: Partial<InsertMembership>): Promise<Membership | undefined> {
    const [updatedMembership] = await db
      .update(memberships)
      .set(membershipData)
      .where(eq(memberships.id, id))
      .returning();
    
    return updatedMembership || undefined;
  }

  async deleteMembership(id: number): Promise<boolean> {
    const result = await db.delete(memberships).where(eq(memberships.id, id)).returning({ id: memberships.id });
    return result.length > 0;
  }

  // Initialize database with seed data
  async seedData(): Promise<void> {
    const membershipCount = await db.select({ count: sql<number>`count(*)` }).from(memberships);
    
    if (membershipCount[0].count === 0) {
      await this.seedMemberships();
    }
    
    const containerCount = await db.select({ count: sql<number>`count(*)` }).from(containers);
    
    if (containerCount[0].count === 0) {
      await this.seedContainers();
    }
  }

  private async seedMemberships(): Promise<void> {
    await db.insert(memberships).values([
      {
        name: "Standard",
        price: "9.99",
        discountPercentage: "5.00",
        description: "Basic membership with 5% discount on all containers"
      },
      {
        name: "Premium",
        price: "19.99",
        discountPercentage: "10.00",
        description: "Premium membership with 10% discount and priority access"
      },
      {
        name: "Enterprise",
        price: "49.99",
        discountPercentage: "15.00",
        description: "Enterprise membership with 15% discount, priority access, and dedicated support"
      }
    ]);
  }

  private async seedContainers(): Promise<void> {
    await db.insert(containers).values([
      {
        name: "40ft High Cube",
        type: "high-cube",
        condition: "new",
        description: "40ft High Cube shipping container, brand new condition. Perfect for overseas shipping or storage.",
        location: "Port of Singapore",
        region: "Asia",
        city: "Singapore",
        price: "3800.00",
        image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        shipping: true,
        availableImmediately: true,
        leaseAvailable: true
      },
      {
        name: "20ft Standard",
        type: "standard",
        condition: "used",
        description: "20ft Standard shipping container, good used condition. Suitable for domestic transport and storage.",
        location: "Port of Rotterdam",
        region: "Europe",
        city: "Rotterdam",
        price: "1900.00",
        image: "https://images.unsplash.com/photo-1577825532597-9a249d96977e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        shipping: true,
        availableImmediately: true,
        leaseAvailable: true
      },
      {
        name: "45ft High Cube",
        type: "high-cube",
        condition: "like-new",
        description: "45ft High Cube container, like-new condition. Maximum capacity for international shipping.",
        location: "Port of Los Angeles",
        region: "North America",
        city: "Los Angeles",
        price: "4500.00",
        image: "https://images.unsplash.com/photo-1531812002163-6b6d5488c2f7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        shipping: true,
        availableImmediately: false,
        leaseAvailable: true
      },
      {
        name: "10ft Storage Container",
        type: "storage",
        condition: "new",
        description: "10ft Storage container, new condition. Ideal for small storage needs and easy transportation.",
        location: "Sydney Container Depot",
        region: "Australia",
        city: "Sydney",
        price: "2200.00",
        image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        shipping: true,
        availableImmediately: true,
        leaseAvailable: false
      },
      {
        name: "20ft Refrigerated",
        type: "refrigerated",
        condition: "used",
        description: "20ft Refrigerated container, good working condition. Perfect for temperature-sensitive goods.",
        location: "Hamburg Port",
        region: "Europe",
        city: "Hamburg",
        price: "7500.00",
        image: "https://images.unsplash.com/photo-1635512936957-0e78d76ed202?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        shipping: true,
        availableImmediately: true,
        leaseAvailable: true
      },
      {
        name: "40ft Flat Rack",
        type: "flat-rack",
        condition: "used",
        description: "40ft Flat Rack container, used condition. Designed for oversized cargo and machinery.",
        location: "Shanghai Port",
        region: "Asia",
        city: "Shanghai",
        price: "3100.00",
        image: "https://images.unsplash.com/photo-1602381043544-5caffeeb3d43?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        shipping: true,
        availableImmediately: false,
        leaseAvailable: true
      },
      {
        name: "40ft Open Top",
        type: "open-top",
        condition: "new",
        description: "40ft Open Top container, new condition. Ideal for tall cargo that can be loaded from above.",
        location: "Durban Port",
        region: "Africa",
        city: "Durban",
        price: "4200.00",
        image: "https://images.unsplash.com/photo-1578582879059-aec3ef28ffdc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        shipping: true,
        availableImmediately: true,
        leaseAvailable: true
      },
      {
        name: "20ft Ventilated",
        type: "ventilated",
        condition: "like-new",
        description: "20ft Ventilated container, like-new condition. Suitable for cargo requiring air circulation.",
        location: "Mumbai Port",
        region: "Asia",
        city: "Mumbai",
        price: "3300.00",
        image: "https://images.unsplash.com/photo-1553608449-9e29ca43c25f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        shipping: true,
        availableImmediately: true,
        leaseAvailable: false
      }
    ]);
  }
}
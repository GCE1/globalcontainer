import { eq, and, or, gte, lte, inArray, ilike, asc, desc, sql, count } from "drizzle-orm";
import { containers, type Container } from "@shared/schema";
import type { Database } from "./db";

export interface SearchParams {
  page?: number;
  sortBy?: string;
  query?: string;
  types?: string;
  conditions?: string;
  city?: string;
  postalCode?: string;
  priceMin?: string;
  priceMax?: string;
  radius?: boolean;
  radiusMiles?: string;
  latitude?: number;
  longitude?: number;
}

export interface SearchResult {
  containers: Container[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
  nearestDepotSearch: boolean;
}

export interface IStorage {
  getContainers(params: SearchParams): Promise<SearchResult>;
}

export class MemStorage implements IStorage {
  constructor(private db: Database) {}

  async getContainers(params: SearchParams = {}): Promise<SearchResult> {
    try {
      console.log('Container search parameters:', params);

      const page = params.page || 1;
      const limit = 12;
      const offset = (page - 1) * limit;

      const whereConditions = [];
      
      if (params.query) {
        whereConditions.push(
          or(
            ilike(containers.type, `%${params.query}%`),
            ilike(containers.condition, `%${params.query}%`),
            ilike(containers.depot_name, `%${params.query}%`)
          )
        );
      }
      
      if (params.types) {
        const typeArray = params.types.split(',');
        whereConditions.push(inArray(containers.type, typeArray));
      }
      
      if (params.conditions) {
        const conditionArray = params.conditions.split(',');
        whereConditions.push(inArray(containers.condition, conditionArray));
      }
      
      if (params.city) {
        whereConditions.push(ilike(containers.city, `%${params.city}%`));
      }
      
      if (params.postalCode) {
        whereConditions.push(eq(containers.postal_code, params.postalCode));
      }
      
      if (params.priceMin) {
        whereConditions.push(gte(containers.price, params.priceMin));
      }
      
      if (params.priceMax) {
        whereConditions.push(lte(containers.price, params.priceMax));
      }

      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Count total results
      const totalCountResult = await this.db
        .select({ count: count() })
        .from(containers)
        .where(whereClause);
      
      const totalCount = totalCountResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      // Build the main query
      let baseQuery = this.db
        .select({
          id: containers.id,
          sku: containers.sku,
          type: containers.type,
          condition: containers.condition,
          quantity: containers.quantity,
          price: containers.price,
          depot_name: containers.depot_name,
          latitude: containers.latitude,
          longitude: containers.longitude,
          address: containers.address,
          city: containers.city,
          state: containers.state,
          postal_code: containers.postal_code,
          country: containers.country,
          createdAt: containers.createdAt,
          updatedAt: containers.updatedAt,
        })
        .from(containers);

      let queryBuilder = baseQuery.where(whereClause);

      // Determine sorting
      let orderBy;
      if (params.latitude !== undefined && params.longitude !== undefined) {
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
          default:
            orderBy = asc(containers.type);
        }
      } else {
        orderBy = asc(containers.type);
      }
      
      const containerResults = await queryBuilder
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);
      
      return {
        containers: containerResults as Container[],
        totalResults: totalCount,
        totalPages: totalPages,
        currentPage: page,
        nearestDepotSearch: params.radius || false
      };
      
    } catch (error) {
      console.error('Database error in container search:', error);
      return {
        containers: [],
        totalResults: 0,
        totalPages: 0,
        currentPage: 1,
        nearestDepotSearch: false
      };
    }
  }
}
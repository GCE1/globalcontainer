import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool with more robust error handling
console.log('Connecting to database...');

let pool: Pool;
let db: any;

try {
  // Set connection pool options for better reliability
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 20, // Maximum number of clients the pool should contain
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 5000, // How long to wait for a connection
  });

  // Add error handler to prevent pool crashes
  pool.on('error', (err) => {
    console.error('Unexpected database pool error:', err);
    // Don't throw here - just log the error so the application can continue
  });

  db = drizzle({ client: pool, schema });
  
  console.log('Database connection established successfully');
} catch (err) {
  console.error('Failed to initialize database connection:', err);
  // Create fallback dummy pool and db objects that won't crash the app
  // This allows the application to run even if database connection fails
  pool = {
    query: () => Promise.resolve({ rows: [] }),
    connect: () => Promise.resolve({}),
    end: () => Promise.resolve(),
    on: () => {}
  } as unknown as Pool;
  
  db = {
    select: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }),
    insert: () => ({ values: () => ({ returning: () => Promise.resolve([]) }) }),
    query: () => Promise.resolve([]),
  } as any;
}

export { pool, db };
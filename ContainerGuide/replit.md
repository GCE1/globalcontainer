# Global Container Exchange - Buyer's Guide Application

## Overview
This repository contains a web application for Global Container Exchange's Buyer's Guide, showcasing shipping container information, specifications, and services. The application is built with a React frontend and Express backend, using a PostgreSQL database with Drizzle ORM for data management.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The application follows a modern client-server architecture with clear separation of concerns:

1. **Frontend**: React-based Single Page Application (SPA) with shadcn/ui component library and TailwindCSS for styling
2. **Backend**: Express.js server that serves both the API endpoints and the static frontend files
3. **Database**: PostgreSQL with Drizzle ORM for type-safe database interactions
4. **State Management**: React Query for server state management and data fetching

The application is designed to be deployed on Replit, with configurations for both development and production environments.

## Key Components

### Frontend
- **UI Framework**: Built with React, utilizing shadcn/ui component library that's based on Radix UI primitives
- **Styling**: TailwindCSS with a custom theme configuration that defines colors, typography, and spacing
- **Navigation**: Uses Wouter for lightweight client-side routing
- **Data Fetching**: React Query for fetching, caching, and updating server state
- **Components**: Modular component architecture with UI components, page components, and shared utilities

Key pages include:
- Buyer's Guide (main page)
- Container Types
- Technical Specifications
- Architectural Innovation
- BIC Code and Capacity Information
- FAQ section

### Backend
- **Server**: Express.js for API and static file serving
- **API Structure**: RESTful API endpoints prefixed with `/api`
- **Storage Interface**: Abstraction layer that allows for different storage implementations (currently using in-memory storage with provisions for database integration)
- **Schema**: Shared schema definitions between frontend and backend using Drizzle ORM and Zod for validation

### Database
- **ORM**: Drizzle ORM for type-safe database access and migrations
- **Schema**: Currently includes a basic user model with support for additional models as needed
- **Connection**: Uses NeonDB Serverless PostgreSQL driver for database connections

## Data Flow

1. **Client Requests**: Browser makes requests to either:
   - Static assets served directly from Express
   - API endpoints for dynamic data

2. **API Processing**:
   - Express routes handle API requests
   - Requests are processed through the storage interface
   - Responses are returned as JSON

3. **Data Storage**:
   - Currently using in-memory storage (MemStorage class)
   - Schema defined in shared/schema.ts for consistent data structure
   - Prepared for transition to PostgreSQL using Drizzle ORM

## External Dependencies

### Frontend Libraries
- **UI Components**: shadcn/ui, Radix UI primitives
- **Styling**: TailwindCSS, class-variance-authority
- **Routing**: Wouter
- **Data Fetching**: TanStack React Query
- **Form Handling**: React Hook Form with Zod validation

### Backend Libraries
- **Server**: Express.js
- **Database**: Drizzle ORM, NeonDB Serverless PostgreSQL driver
- **Development**: Vite for frontend development, tsx for TypeScript execution

## Deployment Strategy

The application is configured for deployment on Replit with two main environments:

### Development
- Run with `npm run dev`
- Uses Vite development server with HMR for frontend
- Backend runs with tsx for TypeScript execution without compilation
- Auto-reloads on code changes

### Production
- Build with `npm run build`
- Vite builds the frontend into static files
- esbuild bundles the server code
- Server serves static files and API endpoints
- Optimized for performance with production settings

The application's deployment is configured in `.replit` and will automatically deploy when pushed to the main branch.

## Getting Started

1. Ensure PostgreSQL module is enabled in your Replit
2. Run `npm install` to install dependencies
3. Set up the required environment variables:
   - `DATABASE_URL`: Connection string for PostgreSQL database
4. Run `npm run dev` to start the development server
5. Run `npm run db:push` to sync the database schema

## Future Development

1. **Database Implementation**: Complete the transition from in-memory storage to PostgreSQL
2. **Authentication**: Implement user authentication and session management
3. **Admin Dashboard**: Create an admin interface for managing container information
4. **Search Functionality**: Implement search and filtering for containers
5. **Responsive Enhancements**: Further optimize the mobile experience
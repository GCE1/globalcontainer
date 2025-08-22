# Global Container Exchange Platform

## Overview

The Global Container Exchange (GCE) platform is a comprehensive container trading and leasing marketplace. It functions as a modern web application, providing a full-featured e-commerce platform specifically designed for the container shipping industry. Key capabilities include advanced admin controls, payment processing, and scalability features, connecting buyers and sellers globally.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application employs a modern full-stack architecture with clear separation between frontend, backend, and data layers.

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Radix UI components with shadcn/ui
- **Styling**: TailwindCSS with custom theme
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Client-side routing with wouter
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **API Design**: RESTful API (`/api` prefix)
- **File Serving**: Express static file serving
- **Image Optimization**: Custom middleware for WebP conversion and automatic format selection

### Database Architecture
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe interactions
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon serverless driver with WebSocket support

### Key Components

#### Core Business Features
- **Container Management**: Inventory system for various container types.
- **Sales & Leasing**: Supports both sales and leasing transactions.
- **Geographic Search**: Location-based search with ZIP code and radius filtering.
- **Pricing Engine**: Dynamic pricing based on type, condition, and location.
- **Order Management**: Full order lifecycle management.
- **Contract System**: Digital contract generation for leasing.

#### Admin Backend Console
- **Role-Based Access Control**: Granular permissions.
- **Two-Factor Authentication**: TOTP-based security.
- **User Management**: Account and subscription management.
- **Analytics Dashboard**: Real-time statistics and reporting.
- **Order Processing**: Administrative tools for order fulfillment.
- **Content Management**: Dynamic pricing and platform configuration.

#### Payment & Billing
- **Multiple Payment Processors**: Stripe integration.
- **Subscription Management**: Tiered membership.
- **Automated Billing**: Per diem calculations and recurring payments.
- **Invoice Generation**: Automated invoice creation.

#### Image Optimization System
- **Comprehensive Hero Optimization**: All 11 platform pages optimized with WebP conversion achieving 84-96% size reductions (total reduction from ~58MB to ~2.8MB).
- **Smart Serving**: Serves optimal WebP format with JPEG fallbacks based on browser support.
- **Performance**: Significant bandwidth savings with optimized hero images stored in optimized_assets directory.

### System Design Choices
- **UI/UX**: Consistent design language using Radix UI/shadcn/ui and TailwindCSS.
- **Performance**: Focus on fast development and optimized production builds (Vite), image optimization, database indexing, caching, bundle optimization, and instant cart navigation using React routing instead of page reloads.
- **Security**: JWT-based authentication, role-based authorization, API rate limiting, data encryption, and HTTPS.
- **Deployment**: Optimized for Replit's deployment environment with a robust build process.
- **Email System**: Integrated email services for notifications, order confirmations, and marketing campaigns with DKIM authentication for deliverability.
- **Mobile Responsiveness**: Comprehensive mobile-first design across all dashboards, forms, and search results for optimal display on various devices.
- **Authentication**: Secure password setup workflow for new users, robust user role management for access control, and handling of free/issued memberships.
- **Container Data Management**: Utilizes authentic container inventory data with SKU-based location extraction and batch processing for stable database connections.
- **Cart & Checkout**: Session-based cart persistence, streamlined checkout flow, hybrid cart system (localStorage-first with server sync), flexible authentication for both guest and authenticated users, optimized cart loading with instant React navigation for modal-to-cart transitions, comprehensive delivery method options including tilt-bed, roll-off, custom-assist, and customer pickup with distance-based pricing calculations, seamless cart-to-checkout delivery method integration with persistent method selection and detailed order summary display for customer service clarity, and **North American distance surcharge calculation system** for extended deliveries (over 50 miles at $7/mile) with comprehensive geocoding database covering Canadian postal codes, US zip codes, and Mexican postal codes with provincial/state regional fallback for unknown addresses within North American shipping zones. **CRITICAL BUSINESS LOGIC: Per-container shipping calculations** - both shipping costs and distance surcharges are calculated per container since each container requires a separate truck delivery ($600-700 shipping per container, distance surcharge multiplied by container quantity).
- **Admin System Settings**: Functionality to issue 1-week free trials and manage email campaigns with advanced recipient controls.
- **Email Generation**: Direct email address creation and management with distribution tracking and technical documentation for administrators.
- **Newsletter File Attachment System**: Complete file upload and attachment management for newsletter campaigns, supporting up to 5 files per newsletter (10MB each) with secure object storage integration, visual file management interface, and proper email delivery with attachments.
- **Production Email System**: Complete email infrastructure overhaul with Jellyfish Systems hosting (mx1/mx2/mx3-hosting.jellyfish.systems MX records), DKIM authentication using default._domainkey.globalcontainerexchange.com, intelligent IMAP fallback for email sync, and Gmail-like popup modal interfaces for all 9 GCE admin email accounts (j.stachow, j.fairbank, t.stel, accounting, info, partnerships, support, sales, admin) with shared password authentication (Greatboxx123@) and independent mailbox access.
- **Production Readiness**: Comprehensive cleanup of redundant features, fixed authentication issues, streamlined navigation structure for deployment, validated distance calculation system with accurate business-critical pricing for extended deliveries, and fully operational Terminal49 API integration with professional error handling for unsupported shipping lines and container formats.
- **Real-Time Container Tracking**: Terminal49 API integration with automatic container number detection, SCAC code extraction, intelligent error handling for unsupported shipping lines, and professional user feedback for tracking limitations. System correctly identifies container format vs booking numbers vs bill of lading and provides appropriate tracking requests to Terminal49's database covering 160+ shipping lines worldwide. Professional glass-effect tracking form in hero section with Terminal49 branding and "Powered by:" attribution for proper API credit.

## External Dependencies

- **Payment Systems**: Stripe (primary payment processor).
- **Geographic Services**: Google Maps API (geocoding, distance calculation, mapping).
- **Email Services**: SendGrid (transactional email delivery), Titan Email (SMTP service for system emails and marketing campaigns).
- **Image Processing**: Sharp (high-performance image processing for optimization).
- **Database Hosting**: Neon (serverless PostgreSQL).
- **Container Tracking**: Terminal49 API (real-time container tracking, 160+ shipping lines support with SCAC code validation), Shipsgo.com API (backup tracking service).
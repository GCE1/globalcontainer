export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  noIndex?: boolean;
}

export const defaultSEO: SEOConfig = {
  title: "Global Container Exchange - Worldwide Container Trading Platform",
  description: "Leading global marketplace for shipping container sales, leasing, modifications, and logistics. Find containers worldwide with competitive pricing and reliable service.",
  keywords: [
    "shipping containers",
    "container sales",
    "container leasing",
    "global container exchange",
    "container marketplace",
    "shipping container trading",
    "container logistics",
    "worldwide container supply"
  ]
};

export const pageSEOConfig: Record<string, SEOConfig> = {
  "/": {
    title: "Global Container Exchange - Worldwide Container Trading Platform",
    description: "Leading global marketplace for shipping container sales, leasing, modifications, and logistics. Find containers worldwide with competitive pricing and reliable service.",
    keywords: [
      "shipping containers",
      "container sales",
      "container leasing",
      "global container exchange",
      "container marketplace",
      "shipping container trading",
      "container logistics",
      "worldwide container supply"
    ],
    ogType: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Global Container Exchange",
      "description": "Leading global marketplace for shipping container sales, leasing, modifications, and logistics",
      "url": "https://globalcontainerexchange.com",
      "logo": "https://globalcontainerexchange.com/assets/GCE-logo.png",
      "sameAs": [
        "https://www.linkedin.com/company/global-container-exchange",
        "https://twitter.com/gce_containers"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Global"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-GCE-TRADE",
        "contactType": "customer service"
      }
    }
  },
  "/container-sales": {
    title: "Container Sales - Buy New & Used Shipping Containers | GCE",
    description: "Buy high-quality new and used shipping containers from verified suppliers worldwide. 20ft, 40ft containers available with competitive pricing and global delivery.",
    keywords: [
      "buy shipping containers",
      "new containers for sale",
      "used containers for sale",
      "20ft containers",
      "40ft containers",
      "container purchase",
      "shipping container suppliers"
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Shipping Containers for Sale",
      "description": "High-quality new and used shipping containers available worldwide",
      "category": "Shipping Equipment",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    }
  },
  "/container-leasing": {
    title: "Container Leasing Services - Flexible Rental Solutions | GCE",
    description: "Flexible container leasing and rental solutions for short-term and long-term needs. Cost-effective alternative to purchasing with global availability.",
    keywords: [
      "container leasing",
      "container rental",
      "shipping container lease",
      "container hire",
      "temporary containers",
      "flexible container solutions"
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Container Leasing Services",
      "description": "Flexible container leasing and rental solutions worldwide",
      "provider": {
        "@type": "Organization",
        "name": "Global Container Exchange"
      }
    }
  },
  "/container-modifications": {
    title: "Container Modifications - Custom Container Solutions | GCE",
    description: "Professional container modification services including office conversions, storage solutions, restaurants, and custom builds. Transform containers for any purpose.",
    keywords: [
      "container modifications",
      "container conversions",
      "custom containers",
      "container office",
      "container restaurant",
      "container home",
      "shipping container modification"
    ]
  },
  "/container-transport": {
    title: "Container Transport & Logistics - Global Shipping Services | GCE",
    description: "Reliable container transport and logistics services worldwide. Professional handling, tracking, and delivery of containers to any destination.",
    keywords: [
      "container transport",
      "container logistics",
      "container shipping",
      "container delivery",
      "global container transport",
      "container freight"
    ]
  },
  "/container-storage": {
    title: "Container Storage Solutions - Secure Storage Services | GCE",
    description: "Secure container storage solutions at strategic locations worldwide. Safe, climate-controlled storage for containers and cargo.",
    keywords: [
      "container storage",
      "secure storage",
      "container warehousing",
      "cargo storage",
      "container depot"
    ]
  },
  "/container-tracking": {
    title: "Container Tracking - Real-time Location & Status | GCE",
    description: "Advanced container tracking system with real-time location updates, status monitoring, and comprehensive logistics visibility.",
    keywords: [
      "container tracking",
      "cargo tracking",
      "real-time tracking",
      "container location",
      "shipping container GPS"
    ]
  },
  "/container-search": {
    title: "Search Containers - Find Available Containers Worldwide | GCE",
    description: "Search and find available shipping containers worldwide by location, type, condition, and price. Advanced filters for precise results.",
    keywords: [
      "search containers",
      "find containers",
      "container availability",
      "container search engine",
      "locate containers"
    ]
  },
  "/wholesale-manager": {
    title: "Wholesale Container Trading - B2B Platform | GCE",
    description: "Professional wholesale container trading platform for bulk purchases, corporate accounts, and B2B transactions with competitive pricing.",
    keywords: [
      "wholesale containers",
      "bulk container purchase",
      "B2B container trading",
      "corporate container solutions",
      "wholesale shipping containers"
    ]
  },
  "/leasing-manager": {
    title: "Leasing Management Platform - Container Fleet Solutions | GCE",
    description: "Comprehensive leasing management platform for container fleet operations, rental tracking, and lease administration.",
    keywords: [
      "leasing management",
      "container fleet management",
      "lease administration",
      "rental management"
    ]
  },
  "/about-us": {
    title: "About Global Container Exchange - Industry Leadership Since 2017",
    description: "Learn about Global Container Exchange, the leading container trading platform connecting buyers and sellers worldwide since 2017. Our mission, vision, and commitment to excellence.",
    keywords: [
      "about GCE",
      "container trading company",
      "shipping container industry",
      "global container marketplace"
    ]
  },
  "/contact-us": {
    title: "Contact Global Container Exchange - Get Expert Support",
    description: "Contact our expert team for container sales, leasing, modifications, and logistics support. Multiple contact options available worldwide.",
    keywords: [
      "contact GCE",
      "container support",
      "shipping container help",
      "container consultation"
    ]
  },
  "/container-guide": {
    title: "Container Buyers Guide - Complete Shipping Container Information",
    description: "Comprehensive guide to buying shipping containers including types, conditions, sizes, pricing, and expert tips for making the right choice.",
    keywords: [
      "container buyers guide",
      "shipping container guide",
      "container types",
      "container buying tips"
    ]
  }
};

export function updatePageSEO(config: SEOConfig, pathname: string = ""): void {
  // Update document title
  document.title = config.title;

  // Update or create meta tags
  updateMetaTag("description", config.description);
  updateMetaTag("keywords", config.keywords.join(", "));
  
  // Canonical URL
  const canonicalUrl = config.canonicalUrl || `${window.location.origin}${pathname}`;
  updateLinkTag("canonical", canonicalUrl);

  // Open Graph tags
  updateMetaTag("og:title", config.title, "property");
  updateMetaTag("og:description", config.description, "property");
  updateMetaTag("og:url", canonicalUrl, "property");
  updateMetaTag("og:type", config.ogType || "website", "property");
  
  if (config.ogImage) {
    updateMetaTag("og:image", config.ogImage, "property");
  }

  // Twitter Card tags
  updateMetaTag("twitter:card", "summary_large_image", "name");
  updateMetaTag("twitter:title", config.title, "name");
  updateMetaTag("twitter:description", config.description, "name");

  // Robots meta tag
  if (config.noIndex) {
    updateMetaTag("robots", "noindex, nofollow");
  } else {
    updateMetaTag("robots", "index, follow");
  }

  // Structured data
  if (config.structuredData) {
    updateStructuredData(config.structuredData);
  }
}

function updateMetaTag(name: string, content: string, attribute: string = "name"): void {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  
  tag.content = content;
}

function updateLinkTag(rel: string, href: string): void {
  let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = rel;
    document.head.appendChild(tag);
  }
  
  tag.href = href;
}

function updateStructuredData(data: object): void {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function getSEOConfig(pathname: string): SEOConfig {
  return pageSEOConfig[pathname] || defaultSEO;
}
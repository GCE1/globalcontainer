import { ReactNode } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { SEOConfig } from '@/lib/seo';

interface SEOWrapperProps {
  children: ReactNode;
  config?: Partial<SEOConfig>;
}

export function SEOWrapper({ children, config }: SEOWrapperProps) {
  useSEO(config);
  return <>{children}</>;
}

// Specific SEO components for different content types
export function ProductSEO({ 
  name, 
  description, 
  price, 
  currency = "USD", 
  availability = "InStock",
  image,
  children 
}: {
  name: string;
  description: string;
  price?: number;
  currency?: string;
  availability?: string;
  image?: string;
  children: ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    ...(image && { "image": image }),
    ...(price && {
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": `https://schema.org/${availability}`,
        "seller": {
          "@type": "Organization",
          "name": "Global Container Exchange"
        }
      }
    })
  };

  const seoConfig = {
    title: `${name} | Global Container Exchange`,
    description: description,
    structuredData: structuredData
  };

  return (
    <SEOWrapper config={seoConfig}>
      {children}
    </SEOWrapper>
  );
}

export function ServiceSEO({
  name,
  description,
  areaServed = "Worldwide",
  children
}: {
  name: string;
  description: string;
  areaServed?: string;
  children: ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "Global Container Exchange",
      "url": "https://globalcontainerexchange.com"
    },
    "areaServed": areaServed,
    "serviceType": "Container Services"
  };

  const seoConfig = {
    title: `${name} | Global Container Exchange`,
    description: description,
    structuredData: structuredData
  };

  return (
    <SEOWrapper config={seoConfig}>
      {children}
    </SEOWrapper>
  );
}

export function ArticleSEO({
  headline,
  description,
  datePublished,
  dateModified,
  author = "Global Container Exchange",
  children
}: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  children: ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Global Container Exchange",
      "logo": {
        "@type": "ImageObject",
        "url": "https://globalcontainerexchange.com/assets/GCE-logo.png"
      }
    }
  };

  const seoConfig = {
    title: `${headline} | GCE Blog`,
    description: description,
    structuredData: structuredData
  };

  return (
    <SEOWrapper config={seoConfig}>
      {children}
    </SEOWrapper>
  );
}
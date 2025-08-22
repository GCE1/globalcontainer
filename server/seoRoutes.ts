import { Router } from 'express';

const router = Router();

// XML Sitemap generation
router.get('/sitemap.xml', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/container-sales', priority: '0.9', changefreq: 'weekly' },
    { loc: '/container-leasing', priority: '0.9', changefreq: 'weekly' },
    { loc: '/container-modifications', priority: '0.8', changefreq: 'weekly' },
    { loc: '/container-transport', priority: '0.8', changefreq: 'weekly' },
    { loc: '/container-storage', priority: '0.8', changefreq: 'weekly' },
    { loc: '/container-tracking', priority: '0.8', changefreq: 'weekly' },
    { loc: '/container-search', priority: '0.9', changefreq: 'daily' },
    { loc: '/wholesale-manager', priority: '0.8', changefreq: 'weekly' },
    { loc: '/leasing-manager', priority: '0.8', changefreq: 'weekly' },
    { loc: '/about-us', priority: '0.7', changefreq: 'monthly' },
    { loc: '/contact-us', priority: '0.7', changefreq: 'monthly' },
    { loc: '/container-guide', priority: '0.8', changefreq: 'weekly' },
    { loc: '/blogs', priority: '0.7', changefreq: 'weekly' },
    { loc: '/memberships', priority: '0.6', changefreq: 'monthly' },
    { loc: '/request-quote', priority: '0.8', changefreq: 'daily' },
    { loc: '/terms-conditions', priority: '0.4', changefreq: 'yearly' },
    { loc: '/privacy-policy', priority: '0.4', changefreq: 'yearly' },
    { loc: '/cookie-policy', priority: '0.4', changefreq: 'yearly' }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.send(sitemap);
});

// Robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  const robotsTxt = `User-agent: *
Allow: /

# Allow search engines to crawl all content
Allow: /container-sales
Allow: /container-leasing
Allow: /container-modifications
Allow: /container-transport
Allow: /container-storage
Allow: /container-tracking
Allow: /container-search
Allow: /wholesale-manager
Allow: /leasing-manager

# Block unnecessary crawling of form submission endpoints
Disallow: /api/
Disallow: /checkout
Disallow: /payment
Disallow: /customer-info
Disallow: /cart
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// Structured data for organization
router.get('/organization.json', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Global Container Exchange",
    "alternateName": "GCE",
    "description": "Leading global marketplace for shipping container sales, leasing, modifications, and logistics services",
    "url": baseUrl,
    "logo": `${baseUrl}/attached_assets/GCE-logo.png`,
    "image": `${baseUrl}/attached_assets/hero%20image.png`,
    "foundingDate": "2017",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Global Operations"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+1-800-GCE-TRADE",
        "contactType": "customer service",
        "availableLanguage": ["English"],
        "areaServed": "Worldwide"
      },
      {
        "@type": "ContactPoint",
        "contactType": "sales",
        "email": "sales@globalcontainerexchange.com",
        "areaServed": "Worldwide"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/company/global-container-exchange",
      "https://twitter.com/gce_containers"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Container Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Container Sales",
            "description": "New and used shipping containers for purchase"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Container Leasing",
            "description": "Flexible container rental and leasing solutions"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Container Modifications",
            "description": "Custom container conversion and modification services"
          }
        }
      ]
    }
  };

  res.json(organizationData);
});

export { router as seoRoutes };
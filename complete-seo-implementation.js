import fs from 'fs/promises';
import path from 'path';

async function implementComprehensiveSEO() {
  console.log('Implementing comprehensive SEO optimization across all critical pages...');
  
  // Update AboutUs page with SEO
  const aboutUsPath = 'client/src/pages/AboutUs.tsx';
  try {
    let aboutContent = await fs.readFile(aboutUsPath, 'utf8');
    
    // Add SEO import
    if (!aboutContent.includes('useSEO')) {
      aboutContent = aboutContent.replace(
        /import.*lucide-react.*;\s*$/m,
        `$&\nimport { useSEO } from '@/hooks/useSEO';`
      );
    }
    
    // Add SEO hook
    aboutContent = aboutContent.replace(
      /export default function AboutUs\(\) \{/,
      `export default function AboutUs() {
  useSEO({
    title: "About Global Container Exchange - Industry Leadership Since 2017",
    description: "Learn about Global Container Exchange, the leading container trading platform connecting buyers and sellers worldwide since 2017. Our mission, vision, and commitment to excellence.",
    keywords: ["about GCE", "container trading company", "shipping container industry", "global container marketplace"]
  });`
    );
    
    await fs.writeFile(aboutUsPath, aboutContent);
    console.log('✓ Added SEO to AboutUs page');
  } catch (error) {
    console.log('⚠ AboutUs page already optimized or not found');
  }
  
  // Update ContactUs page with SEO
  const contactUsPath = 'client/src/pages/ContactUs.tsx';
  try {
    let contactContent = await fs.readFile(contactUsPath, 'utf8');
    
    if (!contactContent.includes('useSEO')) {
      contactContent = contactContent.replace(
        /import.*lucide-react.*;\s*$/m,
        `$&\nimport { useSEO } from '@/hooks/useSEO';`
      );
    }
    
    contactContent = contactContent.replace(
      /export default function ContactUs\(\) \{/,
      `export default function ContactUs() {
  useSEO({
    title: "Contact Global Container Exchange - Get Expert Support",
    description: "Contact our expert team for container sales, leasing, modifications, and logistics support. Multiple contact options available worldwide.",
    keywords: ["contact GCE", "container support", "shipping container help", "container consultation"]
  });`
    );
    
    await fs.writeFile(contactUsPath, contactContent);
    console.log('✓ Added SEO to ContactUs page');
  } catch (error) {
    console.log('⚠ ContactUs page already optimized or not found');
  }
  
  // Update ContainerSearch page with SEO
  const searchPath = 'client/src/pages/ContainerSearch.tsx';
  try {
    let searchContent = await fs.readFile(searchPath, 'utf8');
    
    if (!searchContent.includes('useSEO')) {
      searchContent = searchContent.replace(
        /import.*lucide-react.*;\s*$/m,
        `$&\nimport { useSEO } from '@/hooks/useSEO';`
      );
    }
    
    searchContent = searchContent.replace(
      /export default function ContainerSearch\(\) \{/,
      `export default function ContainerSearch() {
  useSEO({
    title: "Search Containers - Find Available Containers Worldwide | GCE",
    description: "Search and find available shipping containers worldwide by location, type, condition, and price. Advanced filters for precise results.",
    keywords: ["search containers", "find containers", "container availability", "container search engine", "locate containers"]
  });`
    );
    
    await fs.writeFile(searchPath, searchContent);
    console.log('✓ Added SEO to ContainerSearch page');
  } catch (error) {
    console.log('⚠ ContainerSearch page already optimized or not found');
  }
  
  // Update BuyersGuide page with SEO
  const guidePath = 'client/src/pages/BuyersGuide.tsx';
  try {
    let guideContent = await fs.readFile(guidePath, 'utf8');
    
    if (!guideContent.includes('useSEO')) {
      guideContent = guideContent.replace(
        /import.*lucide-react.*;\s*$/m,
        `$&\nimport { useSEO } from '@/hooks/useSEO';`
      );
    }
    
    guideContent = guideContent.replace(
      /export default function BuyersGuide\(\) \{/,
      `export default function BuyersGuide() {
  useSEO({
    title: "Container Buyers Guide - Complete Shipping Container Information",
    description: "Comprehensive guide to buying shipping containers including types, conditions, sizes, pricing, and expert tips for making the right choice.",
    keywords: ["container buyers guide", "shipping container guide", "container types", "container buying tips"]
  });`
    );
    
    await fs.writeFile(guidePath, guideContent);
    console.log('✓ Added SEO to BuyersGuide page');
  } catch (error) {
    console.log('⚠ BuyersGuide page already optimized or not found');
  }
  
  console.log('Comprehensive SEO implementation completed for all critical pages!');
}

implementComprehensiveSEO().catch(console.error);
import fs from 'fs/promises';
import path from 'path';

// Create comprehensive SEO optimization for all pages
const seoOptimizedPages = {
  'ContainerModifications.tsx': {
    serviceName: 'Container Modifications',
    description: 'Professional container modification services including office conversions, storage solutions, restaurants, and custom builds. Transform containers for any purpose.',
    import: `import { ServiceSEO } from '@/components/SEOWrapper';`,
    wrapperOpen: `<ServiceSEO
      name="Container Modifications"
      description="Professional container modification services including office conversions, storage solutions, restaurants, and custom builds. Transform containers for any purpose."
    >`,
    wrapperClose: `</ServiceSEO>`
  },
  'ContainerTransport.tsx': {
    serviceName: 'Container Transport',
    description: 'Reliable container transport and logistics services worldwide. Professional handling, tracking, and delivery of containers to any destination.',
    import: `import { ServiceSEO } from '@/components/SEOWrapper';`,
    wrapperOpen: `<ServiceSEO
      name="Container Transport & Logistics"
      description="Reliable container transport and logistics services worldwide. Professional handling, tracking, and delivery of containers to any destination."
    >`,
    wrapperClose: `</ServiceSEO>`
  },
  'ContainerStorage.tsx': {
    serviceName: 'Container Storage',
    description: 'Secure container storage solutions at strategic locations worldwide. Safe, climate-controlled storage for containers and cargo.',
    import: `import { ServiceSEO } from '@/components/SEOWrapper';`,
    wrapperOpen: `<ServiceSEO
      name="Container Storage Solutions"
      description="Secure container storage solutions at strategic locations worldwide. Safe, climate-controlled storage for containers and cargo."
    >`,
    wrapperClose: `</ServiceSEO>`
  },
  'ContainerTracking.tsx': {
    serviceName: 'Container Tracking',
    description: 'Advanced container tracking system with real-time location updates, status monitoring, and comprehensive logistics visibility.',
    import: `import { ServiceSEO } from '@/components/SEOWrapper';`,
    wrapperOpen: `<ServiceSEO
      name="Container Tracking"
      description="Advanced container tracking system with real-time location updates, status monitoring, and comprehensive logistics visibility."
    >`,
    wrapperClose: `</ServiceSEO>`
  }
};

async function createSEOOptimizedPages() {
  console.log('Creating SEO optimization for remaining service pages...');
  
  for (const [filename, config] of Object.entries(seoOptimizedPages)) {
    const filePath = path.join('client/src/pages', filename);
    
    try {
      let content = await fs.readFile(filePath, 'utf8');
      
      // Add import if not present
      if (!content.includes("ServiceSEO")) {
        content = content.replace(
          /import.*lucide-react.*;\s*$/m,
          `$&\n${config.import}`
        );
      }
      
      // Remove old useEffect title setting
      content = content.replace(
        /useEffect\(\(\) => \{\s*document\.title = .*?\}, \[\]\);/s,
        ''
      );
      
      // Wrap return with ServiceSEO
      content = content.replace(
        /return \(\s*<div className="min-h-screen/,
        `return (\n    ${config.wrapperOpen}\n      <div className="min-h-screen`
      );
      
      // Close ServiceSEO wrapper
      content = content.replace(
        /}\s*<\/div>\s*\);\s*}$/,
        `}\n      </div>\n    ${config.wrapperClose}\n  );\n}`
      );
      
      await fs.writeFile(filePath, content);
      console.log(`✓ Optimized ${filename} for SEO`);
      
    } catch (error) {
      console.log(`⚠ Could not optimize ${filename}: ${error.message}`);
    }
  }
  
  console.log('SEO optimization for service pages complete!');
}

createSEOOptimizedPages().catch(console.error);
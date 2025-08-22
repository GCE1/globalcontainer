import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

// Optimize only the most critical images first
const criticalImages = [
  'hero image.png',
  'GCE-logo.png',
  'container-depot_1749154371445.png',
  'Container-Grades.png',
  'Container-Sales_1749330300707.png',
  'Container-Leasing_1749330394138.png',
  'Container-Tracking_1749330535652.png',
  'Container-Transport_1749330467948.png',
  'Container-Modifications_1749330602464.png',
  'Container-Storage_1749493321153.png'
];

async function optimizeCriticalImages() {
  console.log('Optimizing critical images for immediate deployment...');
  
  for (const imageName of criticalImages) {
    const inputPath = path.join('attached_assets', imageName);
    const outputDir = 'optimized_assets';
    const outputPath = path.join(outputDir, imageName);
    const webpPath = path.join(outputDir, imageName.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    
    try {
      // Check if input exists
      await fs.access(inputPath);
      
      // Create WebP version
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);
      
      // Create optimized PNG/JPG
      await sharp(inputPath)
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`✓ Optimized: ${imageName}`);
    } catch (error) {
      console.log(`⚠ Skipped: ${imageName} (not found)`);
    }
  }
  
  console.log('Critical images optimization complete!');
}

optimizeCriticalImages().catch(console.error);
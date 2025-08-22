import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

async function batchOptimize() {
  console.log('Starting batch optimization of remaining images...');
  
  const batchSize = 10;
  let processed = 0;
  let totalSavings = 0;
  
  // Get all remaining images that haven't been optimized
  const allImages = await getAllImageFiles('attached_assets');
  const optimizedImages = await getAllImageFiles('optimized_assets');
  const optimizedNames = new Set(optimizedImages.map(p => path.basename(p, path.extname(p))));
  
  const remainingImages = allImages.filter(img => {
    const baseName = path.basename(img, path.extname(img));
    return !optimizedNames.has(baseName);
  });
  
  console.log(`Found ${remainingImages.length} images to optimize`);
  
  for (let i = 0; i < remainingImages.length; i += batchSize) {
    const batch = remainingImages.slice(i, i + batchSize);
    
    for (const imagePath of batch) {
      try {
        const originalStats = await fs.stat(imagePath);
        const relativePath = path.relative('attached_assets', imagePath);
        const outputDir = path.join('optimized_assets', path.dirname(relativePath));
        
        await fs.mkdir(outputDir, { recursive: true });
        
        const ext = path.extname(imagePath).toLowerCase();
        const baseName = path.basename(imagePath, ext);
        
        // Create WebP version
        const webpPath = path.join(outputDir, `${baseName}.webp`);
        await sharp(imagePath)
          .webp({ quality: 85, effort: 4 })
          .toFile(webpPath);
        
        // Create optimized original
        const optimizedPath = path.join(outputDir, path.basename(imagePath));
        if (ext === '.png') {
          await sharp(imagePath)
            .png({ quality: 90, compressionLevel: 8 })
            .toFile(optimizedPath);
        } else {
          await sharp(imagePath)
            .jpeg({ quality: 85, progressive: true })
            .toFile(optimizedPath);
        }
        
        const webpStats = await fs.stat(webpPath);
        const savings = originalStats.size - webpStats.size;
        totalSavings += savings;
        processed++;
        
        if (processed % 20 === 0) {
          console.log(`Progress: ${processed}/${remainingImages.length} images`);
        }
        
      } catch (error) {
        console.error(`Error processing ${imagePath}:`, error.message);
      }
    }
  }
  
  console.log(`\nOptimization complete! Processed ${processed} images`);
  console.log(`Total savings: ${(totalSavings / 1024 / 1024).toFixed(1)}MB`);
}

async function getAllImageFiles(dir) {
  const files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await getAllImageFiles(fullPath);
        files.push(...subFiles);
      } else if (isImageFile(entry.name)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory might not exist
  }
  
  return files;
}

function isImageFile(filename) {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

batchOptimize().catch(console.error);
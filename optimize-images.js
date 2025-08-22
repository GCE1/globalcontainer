import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';

class ImageOptimizer {
  constructor() {
    this.processedCount = 0;
    this.totalSavings = 0;
    this.optimizedDir = 'optimized_assets';
  }

  async init() {
    try {
      await fs.mkdir(this.optimizedDir, { recursive: true });
      console.log('✓ Created optimized assets directory');
    } catch (error) {
      console.log('Optimized directory already exists');
    }
  }

  async getAllImageFiles(dir) {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await this.getAllImageFiles(fullPath);
        files.push(...subFiles);
      } else if (this.isImageFile(entry.name)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  isImageFile(filename) {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG', '.JPEG'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext.toLowerCase()));
  }

  async getImageInfo(filePath) {
    try {
      const stats = await fs.stat(filePath);
      const metadata = await sharp(filePath).metadata();
      return {
        size: stats.size,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      };
    } catch (error) {
      console.warn(`Warning: Could not read image info for ${filePath}`);
      return null;
    }
  }

  async optimizeImage(inputPath, outputDir) {
    try {
      const originalInfo = await this.getImageInfo(inputPath);
      if (!originalInfo) return null;

      const relativePath = path.relative('attached_assets', inputPath);
      const outputPath = path.join(outputDir, relativePath);
      const outputDirPath = path.dirname(outputPath);
      
      // Create output directory structure
      await fs.mkdir(outputDirPath, { recursive: true });

      const ext = path.extname(inputPath).toLowerCase();
      const baseName = path.basename(inputPath, ext);
      
      // Generate optimized versions
      const webpPath = path.join(outputDirPath, `${baseName}.webp`);
      const originalOptimizedPath = path.join(outputDirPath, path.basename(inputPath));

      // Create WebP version (best compression, modern browsers)
      await sharp(inputPath)
        .webp({ 
          quality: 85, 
          effort: 6,
          lossless: false 
        })
        .toFile(webpPath);

      // Optimize original format
      if (ext === '.jpg' || ext === '.jpeg') {
        await imagemin([inputPath], {
          destination: outputDirPath,
          plugins: [
            imageminMozjpeg({
              quality: 85,
              progressive: true
            })
          ]
        });
      } else if (ext === '.png') {
        await imagemin([inputPath], {
          destination: outputDirPath,
          plugins: [
            imageminPngquant({
              quality: [0.8, 0.9],
              strip: true
            })
          ]
        });
      }

      // Get optimized file sizes
      const webpStats = await fs.stat(webpPath);
      const originalOptimizedStats = await fs.stat(originalOptimizedPath);
      
      const savings = originalInfo.size - Math.min(webpStats.size, originalOptimizedStats.size);
      this.totalSavings += savings;
      this.processedCount++;

      const compressionRatio = ((savings / originalInfo.size) * 100).toFixed(1);
      
      console.log(`✓ Optimized: ${path.basename(inputPath)} | ${this.formatBytes(originalInfo.size)} → ${this.formatBytes(Math.min(webpStats.size, originalOptimizedStats.size))} | ${compressionRatio}% saved`);
      
      return {
        original: inputPath,
        webp: webpPath,
        optimized: originalOptimizedPath,
        savings: savings,
        compressionRatio: compressionRatio
      };
    } catch (error) {
      console.error(`Error optimizing ${inputPath}:`, error.message);
      return null;
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async optimizeAllImages() {
    console.log('🚀 Starting image optimization for GCE platform...\n');
    
    await this.init();
    
    const imageFiles = await this.getAllImageFiles('attached_assets');
    console.log(`Found ${imageFiles.length} images to optimize\n`);
    
    const results = [];
    const batchSize = 5; // Process images in batches to avoid memory issues
    
    for (let i = 0; i < imageFiles.length; i += batchSize) {
      const batch = imageFiles.slice(i, i + batchSize);
      const batchPromises = batch.map(file => this.optimizeImage(file, this.optimizedDir));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(result => result !== null));
      
      // Progress update
      console.log(`Progress: ${Math.min(i + batchSize, imageFiles.length)}/${imageFiles.length} images processed\n`);
    }
    
    this.printSummary(results);
    await this.createManifest(results);
  }

  printSummary(results) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 OPTIMIZATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Total images processed: ${this.processedCount}`);
    console.log(`💾 Total space saved: ${this.formatBytes(this.totalSavings)}`);
    console.log(`📈 Average compression: ${(this.totalSavings / this.processedCount / 1024).toFixed(1)}KB per image`);
    console.log(`🎯 Optimization complete! All images are now web-optimized.`);
    console.log('='.repeat(60));
  }

  async createManifest(results) {
    const manifest = {
      optimizationDate: new Date().toISOString(),
      totalImages: this.processedCount,
      totalSavings: this.totalSavings,
      totalSavingsFormatted: this.formatBytes(this.totalSavings),
      images: results.map(result => ({
        original: result.original,
        webp: result.webp,
        optimized: result.optimized,
        savings: result.savings,
        compressionRatio: result.compressionRatio
      }))
    };
    
    await fs.writeFile(
      path.join(this.optimizedDir, 'optimization-manifest.json'), 
      JSON.stringify(manifest, null, 2)
    );
    
    console.log(`📄 Optimization manifest created: ${this.optimizedDir}/optimization-manifest.json`);
  }
}

// Run optimization
async function main() {
  const optimizer = new ImageOptimizer();
  await optimizer.optimizeAllImages();
}

main().catch(console.error);

export default ImageOptimizer;
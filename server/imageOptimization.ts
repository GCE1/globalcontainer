import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

export const imageOptimizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Only process image requests from attached_assets
  if (!req.path.startsWith('/attached_assets/') || !isImageRequest(req.path)) {
    return next();
  }

  const originalPath = req.path;
  const filename = path.basename(originalPath);
  
  // Check if client accepts WebP
  const acceptsWebP = req.headers.accept?.includes('image/webp') || false;
  
  // Try to serve optimized version
  if (acceptsWebP) {
    const webpPath = originalPath.replace('/attached_assets/', '/optimized_assets/').replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const webpFile = path.join(process.cwd(), webpPath.substring(1));
    
    if (fs.existsSync(webpFile)) {
      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Vary', 'Accept');
      return res.sendFile(webpFile);
    }
  }
  
  // Try optimized original format
  const optimizedPath = originalPath.replace('/attached_assets/', '/optimized_assets/');
  const optimizedFile = path.join(process.cwd(), optimizedPath.substring(1));
  
  if (fs.existsSync(optimizedFile)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Vary', 'Accept');
    return res.sendFile(optimizedFile);
  }
  
  // Fallback to original
  next();
};

function isImageRequest(path: string): boolean {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
  return imageExtensions.some(ext => path.toLowerCase().endsWith(ext));
}
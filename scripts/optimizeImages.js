const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  inputDir: path.join(__dirname, '../public/images'),
  outputDir: path.join(__dirname, '../public/images/optimized'),
  sizes: [320, 640, 960, 1280, 1920],
  formats: ['webp', 'jpg'],
  quality: 80
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Process all images in the input directory
const processImages = async () => {
  try {
    const files = fs.readdirSync(config.inputDir);
    
    for (const file of files) {
      // Skip directories and non-image files
      const filePath = path.join(config.inputDir, file);
      if (fs.statSync(filePath).isDirectory()) continue;
      
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
      
      const fileName = path.basename(file, ext);
      
      // Load the image
      const image = sharp(filePath);
      
      // Generate optimized versions
      for (const format of config.formats) {
        for (const width of config.sizes) {
          const outputPath = path.join(config.outputDir, `${fileName}-${width}.${format}`);
          
          await image
            .resize(width)
            .toFormat(format, { quality: config.quality })
            .toFile(outputPath);
            
          console.log(`Generated: ${outputPath}`);
        }
      }
    }
    
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
};

processImages();
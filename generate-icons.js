
## 📦 File 55: `scripts/generate-icons.js`

```javascript
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate PNG icons from SVG
async function generateIcons() {
  try {
    // Check if input SVG exists
    if (!fs.existsSync(inputSvg)) {
      console.log('Creating default SVG icon...');
      
      // Create a simple SVG icon if it doesn't exist
      const defaultSvg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" rx="128" fill="url(#gradient)"/>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
            <stop stop-color="#00F0FF"/>
            <stop offset="1" stop-color="#8A2BE2"/>
          </linearGradient>
        </defs>
        <path d="M256 128L384 384H128L256 128Z" fill="white" fill-opacity="0.9"/>
        <circle cx="256" cy="256" r="64" fill="white" fill-opacity="0.2"/>
      </svg>`;
      
      fs.writeFileSync(inputSvg, defaultSvg);
      console.log('Default SVG icon created');
    }

    // Generate icons for each size
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`Generated ${size}x${size} icon`);
    }

    // Generate favicon
    await sharp(inputSvg)
      .resize(64, 64)
      .png()
      .toFile(path.join(outputDir, '../favicon.png'));
    
    console.log('Generated favicon');

    // Generate apple touch icon
    await sharp(inputSvg)
      .resize(180, 180)
      .png()
      .toFile(path.join(outputDir, '../apple-touch-icon.png'));
    
    console.log('Generated apple touch icon');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

// Generate maskable icons (with padding for Android)
async function generateMaskableIcons() {
  try {
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `maskable-icon-${size}x${size}.png`);
      
      // Create a square with padding for maskable icons
      const padding = size * 0.1; // 10% padding
      const svgWithPadding = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="${padding}" y="${padding}" width="${size - padding * 2}" height="${size - padding * 2}" rx="${(size - padding * 2) * 0.25}" fill="url(#gradient)"/>
        <defs>
          <linearGradient id="gradient" x1="${padding}" y1="${padding}" x2="${size - padding}" y2="${size - padding}" gradientUnits="userSpaceOnUse">
            <stop stop-color="#00F0FF"/>
            <stop offset="1" stop-color="#8A2BE2"/>
          </linearGradient>
        </defs>
      </svg>`;
      
      const tempSvg = path.join(outputDir, 'temp.svg');
      fs.writeFileSync(tempSvg, svgWithPadding);
      
      await sharp(tempSvg)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      fs.unlinkSync(tempSvg); // Clean up temp file
      console.log(`Generated maskable ${size}x${size} icon`);
    }
  } catch (error) {
    console.error('Error generating maskable icons:', error);
  }
}

// Run generation
async function main() {
  console.log('Generating app icons...');
  await generateIcons();
  await generateMaskableIcons();
  console.log('Icon generation complete!');
}

main();
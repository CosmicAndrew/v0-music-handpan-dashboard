const fs = require('fs');
const path = require('path');

// SVG content for a handpan-inspired icon
const createHandpanSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bronzeGradient" cx="50%" cy="40%" r="60%">
      <stop offset="0%" style="stop-color:#CD7F32;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8B4513;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#654321;stop-opacity:1" />
    </radialGradient>
    <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#D4A574;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B4513;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#bronzeGradient)" stroke="#654321" stroke-width="2"/>
  
  <!-- Center note (D) -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/6}" fill="url(#centerGradient)" stroke="#654321" stroke-width="1.5"/>
  
  <!-- Outer notes in nonagon pattern -->
  ${Array.from({length: 9}, (_, i) => {
    const angle = (i * 40 - 90) * Math.PI / 180;
    const radius = size * 0.3;
    const noteRadius = size * 0.08;
    const cx = size/2 + Math.cos(angle) * radius;
    const cy = size/2 + Math.sin(angle) * radius;
    return `<circle cx="${cx}" cy="${cy}" r="${noteRadius}" fill="url(#centerGradient)" stroke="#654321" stroke-width="1" opacity="0.9"/>`;
  }).join('')}
  
  <!-- 432 Hz text for larger icons -->
  ${size >= 192 ? `
  <text x="${size/2}" y="${size - size/8}" font-family="Arial, sans-serif" font-size="${size/12}" fill="#FFF" text-anchor="middle" font-weight="bold">
    432 Hz
  </text>
  ` : ''}
</svg>
`;

// SVG for maskable icons (with safe area padding)
const createMaskableSVG = (size) => {
  const safeArea = size * 0.8; // 80% safe area for maskable icons
  const padding = (size - safeArea) / 2;
  
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background for maskable area -->
  <rect x="0" y="0" width="${size}" height="${size}" fill="#1a1a2e"/>
  
  <defs>
    <radialGradient id="bronzeGradient" cx="50%" cy="40%" r="60%">
      <stop offset="0%" style="stop-color:#CD7F32;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8B4513;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#654321;stop-opacity:1" />
    </radialGradient>
    <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#D4A574;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B4513;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <!-- Main handpan circle (smaller for safe area) -->
  <circle cx="${size/2}" cy="${size/2}" r="${safeArea/2 - 2}" fill="url(#bronzeGradient)" stroke="#654321" stroke-width="2"/>
  
  <!-- Center note -->
  <circle cx="${size/2}" cy="${size/2}" r="${safeArea/6}" fill="url(#centerGradient)" stroke="#654321" stroke-width="1.5"/>
  
  <!-- Outer notes -->
  ${Array.from({length: 9}, (_, i) => {
    const angle = (i * 40 - 90) * Math.PI / 180;
    const radius = safeArea * 0.3;
    const noteRadius = safeArea * 0.08;
    const cx = size/2 + Math.cos(angle) * radius;
    const cy = size/2 + Math.sin(angle) * radius;
    return `<circle cx="${cx}" cy="${cy}" r="${noteRadius}" fill="url(#centerGradient)" stroke="#654321" stroke-width="1" opacity="0.9"/>`;
  }).join('')}
</svg>
`;
};

// Icon sizes to generate
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const appleIconSizes = [180];

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate regular icons
iconSizes.forEach(size => {
  const svg = createHandpanSVG(size);
  const filename = path.join(publicDir, `icon-${size}x${size}.png`);
  
  // For now, save as SVG (in production, you'd convert to PNG)
  const svgFilename = filename.replace('.png', '.svg');
  fs.writeFileSync(svgFilename, svg);
  console.log(`Generated ${svgFilename}`);
});

// Generate Apple icons
appleIconSizes.forEach(size => {
  const svg = createHandpanSVG(size);
  const filename = path.join(publicDir, `apple-icon-${size}x${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`Generated ${filename}`);
});

// Generate maskable icons
[192, 512].forEach(size => {
  const svg = createMaskableSVG(size);
  const filename = path.join(publicDir, `icon-${size}x${size}-maskable.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`Generated ${filename}`);
});

console.log('\nIcon generation complete! Note: These are SVG files. For production, convert them to PNG using a tool like sharp or canvas.');
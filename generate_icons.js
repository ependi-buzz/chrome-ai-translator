const sharp = require('sharp');

// 创建基本的 SVG 图标
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#4285f4" rx="100"/>
  <text x="256" y="300" font-size="280" fill="white" text-anchor="middle" font-family="Arial">T</text>
  <path d="M 150 350 L 362 350" stroke="white" stroke-width="30" fill="none"/>
</svg>
`;

// 生成不同尺寸的图标
const sizes = [16, 48, 128];

async function generateIcons() {
  for (const size of sizes) {
    await sharp(Buffer.from(svgIcon))
      .resize(size, size)
      .toFile(`icons/icon${size}.png`);
  }
}

generateIcons().catch(console.error);
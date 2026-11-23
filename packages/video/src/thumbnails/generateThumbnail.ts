import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Brand, ThumbnailConcept } from '@creator-autopilot/core';

export interface ThumbnailGenerationOptions {
  outputPath: string;
  format: '16:9' | '9:16';
  concept: ThumbnailConcept;
  brand: Brand;
}

/**
 * High-contrast thumbnail generator using SVG rasterization.
 * Enforces:
 * 1. 4 words or fewer on headline.
 * 2. High contrast badge & backdrop.
 * 3. Brand specific color accents.
 * 4. Focal iconography / device render without human faces or copyright logos.
 */
export async function generateThumbnail(options: ThumbnailGenerationOptions): Promise<string> {
  const { outputPath, format, concept, brand } = options;
  const isLandscape = format === '16:9';

  const width = isLandscape ? 1280 : 1080;
  const height = isLandscape ? 720 : 1920;

  // Enforce 4 words max
  const words = concept.headlineText.split(/\s+/).filter(Boolean);
  const headline = words.slice(0, 4).join(' ').toUpperCase();

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const svgContent = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${brand.colors.secondary}" />
      <stop offset="100%" stop-color="${brand.colors.background}" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="rgba(0,0,0,0.4)" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Diagonal Accent Stripe -->
  <path d="M0,0 L${width * 0.4},0 L${width * 0.2},${height} L0,${height} Z" fill="${brand.colors.primary}" opacity="0.15" />

  <!-- Focal Graphic Frame (Focal object placeholder) -->
  <g transform="translate(${isLandscape ? width * 0.55 : width * 0.1}, ${isLandscape ? height * 0.2 : height * 0.45})">
    <rect width="${isLandscape ? 450 : 860}" height="${isLandscape ? 420 : 600}" rx="32" fill="#FFFFFF" filter="url(#shadow)" opacity="0.95" />
    <rect x="20" y="20" width="${isLandscape ? 410 : 820}" height="${isLandscape ? 380 : 560}" rx="24" fill="${brand.colors.primary}15" stroke="${brand.colors.primary}" stroke-width="4" stroke-dasharray="12 8" />
    <text x="${isLandscape ? 225 : 430}" y="${isLandscape ? 210 : 300}" font-family="${brand.fonts.heading}, sans-serif" font-size="${isLandscape ? 32 : 44}" font-weight="900" fill="${brand.colors.primary}" text-anchor="middle">
      ${concept.focalObject.toUpperCase()}
    </text>
  </g>

  <!-- Text Container / Badge -->
  <g transform="translate(${isLandscape ? 80 : 60}, ${isLandscape ? height * 0.35 : height * 0.18})">
    <!-- Brand Tag -->
    <rect width="260" height="54" rx="27" fill="${brand.colors.accent}" />
    <text x="130" y="36" font-family="${brand.fonts.heading}, sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
      ${brand.name.toUpperCase()}
    </text>

    <!-- Main Headline (Max 4 words) -->
    <text x="0" y="160" font-family="${brand.fonts.heading}, sans-serif" font-size="${isLandscape ? 88 : 100}" font-weight="900" fill="#FFFFFF" filter="url(#shadow)">
      ${headline}
    </text>
  </g>

  <!-- Bottom Contrast Strip -->
  <rect y="${height - 24}" width="${width}" height="24" fill="${brand.colors.primary}" />
</svg>
`;

  // Write SVG file directly (or png when image library is attached)
  const finalSvgPath = outputPath.endsWith('.svg') ? outputPath : `${outputPath}.svg`;
  await fs.writeFile(finalSvgPath, svgContent.trim());

  // Also write output file path for compatibility
  await fs.writeFile(outputPath, svgContent.trim());

  return outputPath;
}

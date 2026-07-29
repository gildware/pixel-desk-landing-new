#!/usr/bin/env node
/**
 * Extract embedded PNG rasters from hero SVGs, convert to lossless WebP,
 * and rewrite SVGs to reference external WebP files (no quality loss).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;
const PUBLIC = join(ROOT, 'public');

function extractAndConvert(svgPath, options = {}) {
  const { outputDir = dirname(svgPath), prefix = basename(svgPath, '.svg') } = options;
  let svg = readFileSync(svgPath, 'utf8');
  const regex =
    /<image id="([^"]+)"[^>]*\sxlink:href="data:image\/png;base64,([^"]+)"/g;

  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const before = svg.length;
  const images = [];

  svg = svg.replace(regex, (fullMatch, imageId, base64) => {
    const pngBuffer = Buffer.from(base64, 'base64');
    const webpName = `${prefix}-${imageId}.webp`;
    const webpPath = join(outputDir, webpName);
    const pngPath = join(outputDir, `${prefix}-${imageId}.png`);

    writeFileSync(pngPath, pngBuffer);
    execSync(`cwebp -lossless "${pngPath}" -o "${webpPath}"`, { stdio: 'pipe' });
    unlinkSync(pngPath);

    const webpSize = readFileSync(webpPath).length;
    images.push({
      id: imageId,
      pngBytes: pngBuffer.length,
      webpBytes: webpSize,
      file: webpName,
    });

    return fullMatch.replace(`data:image/png;base64,${base64}`, webpName);
  });

  if (images.length > 0) {
    writeFileSync(svgPath, svg);
  }

  return { before, after: svg.length, extracted: images.length, images };
}

const jobs = [
  {
    svg: join(PUBLIC, 'images/figma/hero-parts/project.svg'),
    outputDir: join(PUBLIC, 'images/figma/hero-parts'),
    prefix: 'project',
  },
  {
    svg: join(PUBLIC, 'images/dashboard-preview.svg'),
    outputDir: join(PUBLIC, 'images'),
    prefix: 'dashboard-preview',
  },
];

console.log('Optimizing hero rasters (lossless WebP)…\n');

for (const job of jobs) {
  const result = extractAndConvert(job.svg, {
    outputDir: job.outputDir,
    prefix: job.prefix,
  });
  console.log(`${job.svg}`);
  console.log(`  extracted: ${result.extracted} raster(s)`);
  console.log(`  svg size: ${(result.before / 1024).toFixed(1)}KB → ${(result.after / 1024).toFixed(1)}KB`);
  for (const img of result.images) {
    console.log(
      `  ${img.file}: ${(img.pngBytes / 1024).toFixed(1)}KB PNG → ${(img.webpBytes / 1024).toFixed(1)}KB WebP (lossless)`,
    );
  }
  console.log('');
}

const labelPng = join(PUBLIC, 'images/figma/useful-tool-for.png');
const labelWebp = join(PUBLIC, 'images/figma/useful-tool-for.webp');
if (existsSync(labelPng)) {
  execSync(`cwebp -lossless "${labelPng}" -o "${labelWebp}"`, { stdio: 'pipe' });
  console.log('useful-tool-for: PNG → WebP (lossless)');
}

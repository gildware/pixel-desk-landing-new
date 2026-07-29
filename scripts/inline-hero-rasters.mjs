#!/usr/bin/env node
/**
 * Inline external WebP rasters into SVG for use with <img src="...">.
 * Browsers do not load external xlink:href from SVG img tags.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

function inlineExternalWebp(svgPath) {
  const dir = dirname(svgPath);
  let svg = readFileSync(svgPath, 'utf8');
  const before = svg.length;

  svg = svg.replace(
    /(<image id="([^"]+)"[^>]*\sxlink:href=")([^"]+\.webp)(")/g,
    (match, prefix, id, href, suffix) => {
      if (href.startsWith('data:')) return match;
      const webpPath = join(dir, href);
      const base64 = readFileSync(webpPath).toString('base64');
      return `${prefix}data:image/webp;base64,${base64}${suffix}`;
    },
  );

  writeFileSync(svgPath, svg);
  return { before, after: svg.length };
}

const projectSvg = new URL(
  '../public/images/figma/hero-parts/project.svg',
  import.meta.url,
).pathname;

const result = inlineExternalWebp(projectSvg);
console.log(
  `Inlined WebP avatars into project.svg: ${(result.before / 1024).toFixed(1)}KB → ${(result.after / 1024).toFixed(1)}KB`,
);

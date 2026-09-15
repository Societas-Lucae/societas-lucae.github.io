import type { ImageMetadata } from 'astro';

/**
 * Every file of the media library, keyed by its project path
 * (`/src/assets/uploads/...`). Astro/Vite turns each import into
 * `ImageMetadata`, which lets us pass CMS-managed paths to `<Image />`.
 */
const uploads = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/uploads/**/*.{png,jpg,jpeg,webp,avif,gif,svg}',
  { eager: true }
);

export function resolveImage(path: string | undefined | null): ImageMetadata | undefined {
  if (!path) return undefined;
  const entry = uploads[path];
  if (!entry) {
    console.warn(`[images] Unknown upload path: ${path}`);
    return undefined;
  }
  return entry.default;
}

export function requireImage(path: string): ImageMetadata {
  const image = resolveImage(path);
  if (!image) throw new Error(`[images] Missing image: ${path}`);
  return image;
}

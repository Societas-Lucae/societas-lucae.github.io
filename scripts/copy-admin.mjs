// Copies the pinned Sveltia CMS bundle from node_modules into public/admin
// so the admin dashboard is served from our own domain (no CDN dependency).
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkgDir = path.join(root, 'node_modules', '@sveltia', 'cms');
const { version } = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
const source = path.join(pkgDir, 'dist', 'sveltia-cms.js');
const target = path.join(root, 'public', 'admin', 'sveltia-cms.js');

mkdirSync(path.dirname(target), { recursive: true });
copyFileSync(source, target);
console.log(`[admin] Sveltia CMS ${version} copied to public/admin/sveltia-cms.js`);

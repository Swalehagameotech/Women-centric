import { cpSync, existsSync, rmSync } from 'node:fs';

if (!existsSync('dist')) {
  console.error('Build failed: dist/ folder not found. Run vite build first.');
  process.exit(1);
}

if (existsSync('.dist')) {
  rmSync('.dist', { recursive: true });
}

cpSync('dist', '.dist', { recursive: true });
console.log('Copied dist/ → .dist/ for Render publish directory');

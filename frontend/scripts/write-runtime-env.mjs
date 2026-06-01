import { writeFileSync } from 'node:fs';

const apiBaseUrl = (process.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');

writeFileSync(
  'public/runtime-env.js',
  `window.__API_BASE_URL__ = ${JSON.stringify(apiBaseUrl)};\n`,
  'utf8',
);

if (!apiBaseUrl) {
  console.warn(
    'Warning: VITE_API_BASE_URL is not set. The live site cannot load products until you set it on Render and redeploy.',
  );
} else {
  console.log(`Wrote runtime-env.js with API base: ${apiBaseUrl}`);
}

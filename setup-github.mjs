// GitHub only runs workflows from ".github/workflows/".
// To keep this project flat, the workflow ships as render.yml in the root.
// Run once:  npm run setup-github   -> copies it to the place GitHub expects.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const dest = path.join(dir, '.github', 'workflows');
fs.mkdirSync(dest, {recursive: true});
fs.copyFileSync(path.join(dir, 'render.yml'), path.join(dest, 'render.yml'));
console.log('[setup-github] copied render.yml -> .github/workflows/render.yml');
console.log('Now: git add . && git commit -m "add workflow" && git push');

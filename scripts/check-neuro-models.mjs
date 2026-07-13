import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const content = fs.readFileSync(path.join(root, 'src/content/neuroanatomia.ts'), 'utf8');
const referenced = [...content.matchAll(/['"](\/models\/[^'"]+\.obj)['"]/g)].map(match => match[1]);
const missing = referenced.filter(url => !fs.existsSync(path.join(root, 'public', url)));
const requiredPairs = ['FJ3860_', 'FJ3876_', 'FJ3869_', 'FJ3877_'];
const missingPairs = requiredPairs.filter(prefix => !referenced.some(url => path.basename(url).startsWith(prefix)));

const modelDir = path.join(root, 'public/models');
const markers = ['gyrus', 'lobule', 'cuneus', 'precuneus', 'operculum', 'pole.obj', 'entorhinal area', 'subiculum', 'uncus'];
const cortical = fs.readdirSync(modelDir).filter(file => file.endsWith('.obj') && markers.some(marker => file.toLowerCase().includes(marker)));
const corticalBytes = cortical.reduce((total, file) => total + fs.statSync(path.join(modelDir, file)).size, 0);

if (missing.length || missingPairs.length || cortical.length < 60 || corticalBytes > 15 * 1024 * 1024) {
  console.error({ missing, missingPairs, corticalCount: cortical.length, corticalMB: (corticalBytes / 1024 / 1024).toFixed(1) });
  process.exit(1);
}

console.log(`Neuro 3D OK: ${referenced.length} referências válidas, 4 pares completos e ${cortical.length} modelos corticais (${(corticalBytes / 1024 / 1024).toFixed(1)} MB).`);

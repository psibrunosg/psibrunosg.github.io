// Converte public/img/monster-*.png (3-6MB cada) em public/img/monstros/*.webp (~100KB)
// Uso: node scripts/otimizar-monstros.mjs
import sharp from "sharp";
import { readdirSync, mkdirSync } from "fs";
import path from "path";

const src = "public/img";
const out = "public/img/monstros";
mkdirSync(out, { recursive: true });

const files = readdirSync(src).filter((f) => f.startsWith("monster-") && f.endsWith(".png"));
for (const f of files) {
  const id = f.replace("monster-", "").replace(".png", "");
  const dest = path.join(out, `${id}.webp`);
  await sharp(path.join(src, f))
    .resize({ width: 640, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dest);
  console.log(`${id}.webp ok`);
}

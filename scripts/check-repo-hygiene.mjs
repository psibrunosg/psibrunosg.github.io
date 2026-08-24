import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const forbiddenPaths = [
  '.claude-flow',
  'graphify-out',
  'public/admin',
  'src/components/ui/AuroraBackground.tsx',
  'src/components/ui/BentoGrid.tsx',
  'src/components/ui/CardHoverEffect.tsx',
  'src/components/ui/FloatingBlobs.tsx',
  'src/components/ui/FloatingNav.tsx',
  'src/components/ui/HeroParallax.tsx',
  'src/components/ui/InfiniteMovingCards.tsx',
  'src/components/ui/MagneticCursor.tsx',
  'src/components/ui/ScrollProgress.tsx',
  'src/components/ui/Spotlight.tsx',
  'src/components/ui/StickyScrollReveal.tsx',
  'src/components/ui/TextGenerateEffect.tsx',
  'src/components/ui/WaveDivider.tsx',
];

const remaining = forbiddenPaths.filter((relativePath) =>
  fs.existsSync(path.join(root, relativePath)),
);

const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
const requiredIgnoreEntries = ['.claude-flow/', 'graphify-out/'];
const missingIgnoreEntries = requiredIgnoreEntries.filter(
  (entry) => !gitignore.split(/\r?\n/).includes(entry),
);

if (remaining.length || missingIgnoreEntries.length) {
  console.error('Repo hygiene check failed.', {
    remaining,
    missingIgnoreEntries,
  });
  process.exit(1);
}

console.log('Repo hygiene OK: generated reports, obsolete CMS and dead UI files are absent.');

const fs = require('node:fs');
const path = require('node:path');

const platform = process.argv[2];
const version = process.argv[3];
if (!platform || !version) throw new Error('Usage: node scripts/normalize-artifact.js <platform> <version>');

const dist = path.resolve('dist');
const expected = `Sonaris-${version}-${platform}.zip`;
const target = path.join(dist, expected);

if (fs.existsSync(target) && fs.statSync(target).size > 0) {
  console.log(`Artifact already normalized: ${target}`);
  process.exit(0);
}

const candidates = fs.readdirSync(dist).filter((name) => name.endsWith('.zip') && name !== expected);
if (candidates.length === 0) throw new Error(`No zip artifact found in ${dist}`);

const source = path.join(dist, candidates[candidates.length - 1]);
fs.renameSync(source, target);
for (const name of candidates) {
  const file = path.join(dist, name);
  if (file !== target && fs.existsSync(file)) fs.rmSync(file);
}
console.log(`Normalized ${source} to ${target}`);

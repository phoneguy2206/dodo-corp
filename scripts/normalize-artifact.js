const fs = require('node:fs');
const path = require('node:path');

const platform = process.argv[2];
const version = process.argv[3];
if (!platform || !version) throw new Error('Usage: node scripts/normalize-artifact.js <platform> <version>');
const dist = path.resolve('dist');
const expected = `Sonaris-${version}-${platform}.zip`;
const existing = fs.readdirSync(dist).filter((name) => name.endsWith('.zip') && name !== expected);
if (existing.length === 0) throw new Error(`No zip artifact found in ${dist}`);
const source = path.join(dist, existing[existing.length - 1]);
const target = path.join(dist, expected);
if (source !== target) fs.renameSync(source, target);
for (const name of existing) {
  const file = path.join(dist, name);
  if (file !== target && fs.existsSync(file)) fs.rmSync(file);
}
console.log(`Normalized ${source} to ${target}`);

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
const flags = JSON.parse(readFileSync(new URL('./flags.json', import.meta.url)));
const lines = Object.entries(flags)
  .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(createHash('sha256').update(v).digest('hex'))},`)
  .join('\n');
writeFileSync('src/core/flagHashes.ts', `export const FLAG_HASHES: Record<string, string> = {\n${lines}\n};\n`);
console.log('wrote', Object.keys(flags).length, 'hashes');

const fs = require('fs');

const content = fs.readFileSync('/vercel/share/v0-project/app/usage/page.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Skip comments and strings for a rough check
  for (let c of line) {
    if (c === '{') balance++;
    if (c === '}') balance--;
  }
  if (balance < 0) {
    console.log(`Line ${i + 1}: Balance went negative (${balance})`);
    console.log(`  ${line}`);
  }
}
console.log(`Final balance: ${balance}`);

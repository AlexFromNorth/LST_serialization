import { serialize, deserialize, simpleSerialize, simpleDeserialize } from './serialize.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function runTest(name, arr) {
  const simple = simpleSerialize(arr);
  const compressed = serialize(arr);
  const ratio = (simple.length / compressed.length).toFixed(2);
  const restored = deserialize(compressed);
  const sortedOrig = [...arr].sort((a, b) => a - b);
  const sortedRest = [...restored].sort((a, b) => a - b);
  const ok = JSON.stringify(sortedOrig) === JSON.stringify(sortedRest) ? '✓' : '✗';
  console.log(`\n--- ${name} (${ok}) ---`);
  console.log('Count:', arr.length);
  console.log('Original (simple):', simple.length, 'chars');
  console.log('Compressed:', compressed.length, 'chars');
  console.log('Compression ratio:', ratio + 'x');
  if (arr.length <= 20) {
    console.log('Sample original:', simple.slice(0, 60) + (simple.length > 60 ? '...' : ''));
    console.log('Compressed str:', compressed.slice(0, 60) + (compressed.length > 60 ? '...' : ''));
  }
  return { name, simple, compressed, ratio: parseFloat(ratio), ok };
}

console.log('=== Set Serialization — Test Results ===\n');

runTest('Short simple', [1, 300, 237, 188, 42]);

runTest('Random 50', Array.from({ length: 50 }, () => randomInt(1, 300)));
runTest('Random 100', Array.from({ length: 100 }, () => randomInt(1, 300)));
runTest('Random 500', Array.from({ length: 500 }, () => randomInt(1, 300)));
runTest('Random 1000', Array.from({ length: 1000 }, () => randomInt(1, 300)));

runTest('All 1-digit', Array.from({ length: 50 }, () => randomInt(1, 9)));
runTest('All 2-digit', Array.from({ length: 50 }, () => randomInt(10, 99)));
runTest('All 3-digit', Array.from({ length: 50 }, () => randomInt(100, 300)));

const eachThree = [];
for (let n = 1; n <= 300; n++) eachThree.push(n, n, n);
runTest('Each number ×3 (900 total)', eachThree);

console.log('\n=== Round-trip check ===');
const sample = [1, 2, 300, 150, 99];
const enc = serialize(sample);
const dec = deserialize(enc);
console.log('Sample:', sample, '→', enc, '→', dec, JSON.stringify(sample.sort((a,b)=>a-b)) === JSON.stringify(dec.sort((a,b)=>a-b)) ? '✓' : '✗');

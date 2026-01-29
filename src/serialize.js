const MIN = 1;
const MAX = 300;
const BASE = 95;
const CHARS = Array.from({ length: BASE }, (_, i) => String.fromCharCode(32 + i));
const PAIR_DIV = MAX + 1;

function toBase95(value, digits) {
  let s = '';
  for (let i = 0; i < digits; i++) {
    s = CHARS[value % BASE] + s;
    value = Math.floor(value / BASE);
  }
  return s;
}

function fromBase95(str) {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 32;
    if (code < 0 || code >= BASE) throw new Error('Invalid serialized string');
    value = value * BASE + code;
  }
  return value;
}

export function serialize(arr) {
  if (!Array.isArray(arr)) throw new Error('Expected array');
  const copy = [...arr].filter((n) => n >= MIN && n <= MAX);
  let out = '';
  for (let i = 0; i < copy.length; i += 2) {
    const a = copy[i];
    const b = i + 1 < copy.length ? copy[i + 1] : 0;
    const index = (a - MIN) * PAIR_DIV + b;
    out += toBase95(index, 3);
  }
  return out;
}

export function deserialize(str) {
  if (typeof str !== 'string') throw new Error('Expected string');
  const out = [];
  for (let i = 0; i < str.length; i += 3) {
    const chunk = str.slice(i, i + 3);
    if (chunk.length !== 3) throw new Error('Invalid serialized string');
    const index = fromBase95(chunk);
    const a = Math.floor(index / PAIR_DIV) + MIN;
    const b = index % PAIR_DIV;
    out.push(a);
    if (b !== 0) out.push(b);
  }
  return out;
}

export function simpleSerialize(arr) {
  return arr.join(',');
}

export function simpleDeserialize(str) {
  return str ? str.split(',').map(Number) : [];
}

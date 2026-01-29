import { serialize, deserialize, simpleSerialize, simpleDeserialize } from './serialize.js';

describe('serialize/deserialize', () => {
  test('round-trip preserves multiset', () => {
    const arr = [1, 300, 237, 188, 42];
    expect(deserialize(serialize(arr)).sort((a, b) => a - b)).toEqual([...arr].sort((a, b) => a - b));
  });

  test('compression ratio >= 2 for typical input', () => {
    const arr = Array.from({ length: 100 }, (_, i) => ((i * 3) % 300) + 1);
    const simple = simpleSerialize(arr);
    const compressed = serialize(arr);
    expect(simple.length / compressed.length).toBeGreaterThanOrEqual(2);
  });

  test('only 1-300 are serialized', () => {
    const arr = [0, 1, 300, 301, 150];
    const out = deserialize(serialize(arr));
    expect(out.sort((a, b) => a - b)).toEqual([1, 150, 300]);
  });

  test('empty array', () => {
    expect(serialize([])).toBe('');
    expect(deserialize('')).toEqual([]);
  });

  test('single element', () => {
    const arr = [42];
    expect(deserialize(serialize(arr))).toEqual(arr);
  });

  test('invalid input throws', () => {
    expect(() => serialize('not array')).toThrow();
    expect(() => deserialize(123)).toThrow();
  });
});

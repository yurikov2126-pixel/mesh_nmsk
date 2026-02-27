import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clampTail,
  cn,
  filterSimilar,
  formatTime,
  isSimilarText,
  pickRandom,
  shuffle,
} from './utils';

/* ── cn ──────────────────────────────────────────── */

describe('cn', () => {
  it('merges multiple class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters out falsy values', () => {
    expect(cn('a', false, null, undefined, 0, '', 'b')).toBe('a b');
  });

  it('returns empty string when called with no args', () => {
    expect(cn()).toBe('');
  });

  it('handles conditional classes via object syntax', () => {
    expect(cn({ active: true, hidden: false })).toBe('active');
  });
});

/* ── pickRandom ──────────────────────────────────── */

describe('pickRandom', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the element selected by Math.random', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(pickRandom([10, 20, 30])).toBe(20);
  });

  it('returns the only element from a single-element array', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(pickRandom(['only'])).toBe('only');
  });

  it('returns first element when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(pickRandom([1, 2, 3])).toBe(1);
  });

  it('returns last element when Math.random is close to 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(pickRandom([1, 2, 3])).toBe(3);
  });
});

/* ── shuffle ─────────────────────────────────────── */

describe('shuffle', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns an array with the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(arr.length);
  });

  it('does not mutate the original array', () => {
    const arr = [1, 2, 3];
    const copy = [...arr];
    shuffle(arr);
    expect(arr).toEqual(copy);
  });

  it('contains all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr).sort()).toEqual([...arr].sort());
  });

  it('returns an empty array for empty input', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('returns a single-element array unchanged', () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it('produces a deterministic result with mocked Math.random', () => {
    // Mock returns 0.5 on every call → deterministic shuffle
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = shuffle([1, 2, 3, 4]);
    // With Math.random always 0.5: i=3 j=2 swap(3,2)→[1,2,4,3]; i=2 j=1 swap(2,1)→[1,4,2,3]; i=1 j=1 no swap
    expect(result).toEqual([1, 4, 2, 3]);
  });
});

/* ── clampTail ───────────────────────────────────── */

describe('clampTail', () => {
  it('returns the full array when length <= max', () => {
    expect(clampTail([1, 2, 3], 5)).toEqual([1, 2, 3]);
  });

  it('returns the full array when length equals max', () => {
    expect(clampTail([1, 2, 3], 3)).toEqual([1, 2, 3]);
  });

  it('returns the last max elements when array exceeds max', () => {
    expect(clampTail([1, 2, 3, 4, 5], 3)).toEqual([3, 4, 5]);
  });

  it('returns empty array when max is 0', () => {
    expect(clampTail([1, 2, 3], 0)).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(clampTail([], 5)).toEqual([]);
  });
});

/* ── formatTime ──────────────────────────────────── */

describe('formatTime', () => {
  it('formats midnight as 00:00', () => {
    expect(formatTime(new Date(2024, 0, 1, 0, 0))).toBe('00:00');
  });

  it('pads single-digit hours and minutes', () => {
    expect(formatTime(new Date(2024, 0, 1, 9, 5))).toBe('09:05');
  });

  it('formats 23:59 correctly', () => {
    expect(formatTime(new Date(2024, 0, 1, 23, 59))).toBe('23:59');
  });

  it('formats noon as 12:00', () => {
    expect(formatTime(new Date(2024, 0, 1, 12, 0))).toBe('12:00');
  });
});

/* ── isSimilarText ───────────────────────────────── */

describe('isSimilarText', () => {
  it('returns true when a contains b (case-insensitive)', () => {
    expect(isSimilarText('Hello World', 'hello')).toBe(true);
  });

  it('returns true when b contains a (case-insensitive)', () => {
    expect(isSimilarText('hi', 'HI there')).toBe(true);
  });

  it('returns false when neither contains the other', () => {
    expect(isSimilarText('foo', 'bar')).toBe(false);
  });

  it('returns true for identical strings', () => {
    expect(isSimilarText('test', 'test')).toBe(true);
  });

  it('returns true when one string is empty (empty is substring of any)', () => {
    expect(isSimilarText('', 'anything')).toBe(true);
    expect(isSimilarText('anything', '')).toBe(true);
  });

  it('returns true when both strings are empty', () => {
    expect(isSimilarText('', '')).toBe(true);
  });
});

/* ── filterSimilar ───────────────────────────────── */

describe('filterSimilar', () => {
  it('removes candidates similar to recent texts', () => {
    const candidates = ['Hello World', 'Goodbye', 'Hello again'];
    const recent = ['hello'];
    expect(filterSimilar(candidates, recent)).toEqual(['Goodbye']);
  });

  it('keeps all candidates when none match recent texts', () => {
    const candidates = ['alpha', 'beta'];
    const recent = ['gamma'];
    expect(filterSimilar(candidates, recent)).toEqual(['alpha', 'beta']);
  });

  it('returns empty array when all candidates are similar', () => {
    const candidates = ['foo', 'foobar'];
    const recent = ['foo'];
    expect(filterSimilar(candidates, recent)).toEqual([]);
  });

  it('returns all candidates when recent texts is empty', () => {
    const candidates = ['a', 'b', 'c'];
    expect(filterSimilar(candidates, [])).toEqual(['a', 'b', 'c']);
  });

  it('returns empty array for empty candidates', () => {
    expect(filterSimilar([], ['recent'])).toEqual([]);
  });
});

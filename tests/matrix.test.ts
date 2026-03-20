import { describe, it, expect } from 'vitest';
import {
  applyMargin,
  invertMatrix,
  rotateMatrix,
  scaleMatrix,
  countDarkModules,
  getCell,
} from '../src/core/matrix.js';

const SAMPLE: boolean[][] = [
  [true, false, true],
  [false, true, false],
  [true, true, false],
];

describe('applyMargin', () => {
  it('should add margin of specified size', () => {
    const result = applyMargin(SAMPLE, 1);
    expect(result.length).toBe(5); // 3 + 1*2
    expect(result[0]!.length).toBe(5);
  });

  it('should fill margin with false', () => {
    const result = applyMargin(SAMPLE, 2);
    // Top margin rows
    expect(result[0]!.every((c) => c === false)).toBe(true);
    expect(result[1]!.every((c) => c === false)).toBe(true);
    // Bottom margin rows
    expect(result[6]!.every((c) => c === false)).toBe(true);
  });

  it('should preserve original data in center', () => {
    const result = applyMargin(SAMPLE, 1);
    expect(result[1]![1]).toBe(true);  // SAMPLE[0][0]
    expect(result[1]![2]).toBe(false); // SAMPLE[0][1]
    expect(result[2]![2]).toBe(true);  // SAMPLE[1][1]
  });

  it('should return copy when margin is 0', () => {
    const result = applyMargin(SAMPLE, 0);
    expect(result).toEqual(SAMPLE);
    expect(result).not.toBe(SAMPLE); // não a mesma referência
  });

  it('should handle empty matrix', () => {
    const result = applyMargin([], 2);
    expect(result.length).toBe(4);
    expect(result[0]!.length).toBe(4);
  });
});

describe('invertMatrix', () => {
  it('should invert all values', () => {
    const result = invertMatrix(SAMPLE);
    expect(result[0]![0]).toBe(false);
    expect(result[0]![1]).toBe(true);
    expect(result[1]![1]).toBe(false);
  });

  it('should not mutate original', () => {
    const original = [[true, false], [false, true]];
    invertMatrix(original);
    expect(original[0]![0]).toBe(true);
  });

  it('should double-invert back to original', () => {
    const result = invertMatrix(invertMatrix(SAMPLE));
    expect(result).toEqual(SAMPLE);
  });
});

describe('rotateMatrix', () => {
  it('should rotate 90° clockwise', () => {
    const input: boolean[][] = [
      [true, false],
      [false, true],
    ];
    const result = rotateMatrix(input);
    // After 90° CW: top-left becomes top-right
    expect(result).toEqual([
      [false, true],
      [true, false],
    ]);
  });

  it('should return to original after 4 rotations', () => {
    let m = SAMPLE;
    for (let i = 0; i < 4; i++) {
      m = rotateMatrix(m);
    }
    expect(m).toEqual(SAMPLE);
  });
});

describe('scaleMatrix', () => {
  it('should scale by factor 2', () => {
    const input: boolean[][] = [
      [true, false],
      [false, true],
    ];
    const result = scaleMatrix(input, 2);
    expect(result.length).toBe(4);
    expect(result[0]!.length).toBe(4);
    expect(result[0]).toEqual([true, true, false, false]);
    expect(result[1]).toEqual([true, true, false, false]);
    expect(result[2]).toEqual([false, false, true, true]);
  });

  it('should return copy when factor is 1', () => {
    const result = scaleMatrix(SAMPLE, 1);
    expect(result).toEqual(SAMPLE);
  });
});

describe('countDarkModules', () => {
  it('should count dark modules', () => {
    expect(countDarkModules(SAMPLE)).toBe(5);
  });

  it('should return 0 for empty matrix', () => {
    expect(countDarkModules([])).toBe(0);
  });

  it('should return 0 for all-light matrix', () => {
    const m = [[false, false], [false, false]];
    expect(countDarkModules(m)).toBe(0);
  });
});

describe('getCell', () => {
  it('should return cell value', () => {
    expect(getCell(SAMPLE, 0, 0)).toBe(true);
    expect(getCell(SAMPLE, 0, 1)).toBe(false);
  });

  it('should return false for out-of-bounds', () => {
    expect(getCell(SAMPLE, -1, 0)).toBe(false);
    expect(getCell(SAMPLE, 0, 99)).toBe(false);
    expect(getCell(SAMPLE, 99, 0)).toBe(false);
  });
});
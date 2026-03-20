import { describe, it, expect } from 'vitest';
import { renderBraille } from '../src/renderers/braille.js';

describe('renderBraille', () => {
  it('should render a 4x2 matrix as single braille character', () => {
    // Todos os 8 dots ativos = ⣿ (U+28FF)
    const allDark: boolean[][] = [
      [true, true],
      [true, true],
      [true, true],
      [true, true],
    ];
    const result = renderBraille(allDark);
    expect(result).toBe('⣿');
  });

  it('should render blank braille for all-light matrix', () => {
    const allLight: boolean[][] = [
      [false, false],
      [false, false],
      [false, false],
      [false, false],
    ];
    const result = renderBraille(allLight);
    // U+2800 braille blank
    expect(result).toBe('⠀');
  });

  it('should handle matrix larger than 4x2', () => {
    const matrix: boolean[][] = [
      [true, true, true, true],
      [true, true, true, true],
      [true, true, true, true],
      [true, true, true, true],
    ];
    const result = renderBraille(matrix);
    // 4 cols / 2 = 2 braille chars per line
    // 4 rows / 4 = 1 line
    expect(result).toBe('⣿⣿');
  });

  it('should handle multiple rows of braille', () => {
    const matrix: boolean[][] = Array(8)
      .fill(null)
      .map(() => [true, true]);

    const result = renderBraille(matrix);
    const lines = result.split('\n');
    expect(lines.length).toBe(2);
  });

  it('should handle non-aligned matrix dimensions', () => {
    // 3 rows x 3 cols — não é múltiplo de 4x2
    const matrix: boolean[][] = [
      [true, false, true],
      [false, true, false],
      [true, true, true],
    ];
    const result = renderBraille(matrix);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should produce compact output', () => {
    // Um QR version 1 (21x21) deve caber em poucas linhas
    const size = 21;
    const matrix: boolean[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(true) as boolean[]);

    const result = renderBraille(matrix);
    const lines = result.split('\n');
    // 21 rows / 4 = 6 lines (ceil)
    expect(lines.length).toBe(6);
    // 21 cols / 2 = 11 chars per line (ceil)
    expect(lines[0]!.length).toBe(11);
  });
});
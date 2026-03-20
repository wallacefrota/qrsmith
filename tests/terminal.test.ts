import { describe, it, expect } from 'vitest';
import { renderTerminal } from '../src/renderers/terminal.js';

const SAMPLE: boolean[][] = [
  [true, false, true, false],
  [false, true, false, true],
  [true, true, false, false],
  [false, false, true, true],
];

describe('renderTerminal', () => {
  it('should render in default style', () => {
    const result = renderTerminal(SAMPLE, {
      style: 'default',
      invert: false,
    });
    expect(result).toContain('██');
    expect(result.split('\n').length).toBe(4);
  });

  it('should render in compact style (half height)', () => {
    const result = renderTerminal(SAMPLE, {
      style: 'compact',
      invert: false,
    });
    // 4 rows → 2 lines (compacted)
    expect(result.split('\n').length).toBe(2);
    expect(result).toContain('▀');
  });

  it('should render in braille style', () => {
    const result = renderTerminal(SAMPLE, {
      style: 'braille',
      invert: false,
    });
    // 4 rows / 4 rows per braille char = 1 line
    expect(result.split('\n').length).toBe(1);
  });

  it('should render in blocks style', () => {
    const result = renderTerminal(SAMPLE, {
      style: 'blocks',
      invert: false,
    });
    expect(result).toContain('⬛');
    expect(result).toContain('⬜');
  });

  it('should render in dots style', () => {
    const result = renderTerminal(SAMPLE, {
      style: 'dots',
      invert: false,
    });
    expect(result.split('\n').length).toBe(2); // compactado
  });

  it('should render in rounded style', () => {
    const result = renderTerminal(SAMPLE, {
      style: 'rounded',
      invert: false,
    });
    expect(result).toContain('●');
  });

  it('should invert colors', () => {
    const normal = renderTerminal([[true, false]], {
      style: 'default',
      invert: false,
    });
    const inverted = renderTerminal([[true, false]], {
      style: 'default',
      invert: true,
    });
    expect(normal).not.toBe(inverted);
  });

  it('should apply foreground color', () => {
    const result = renderTerminal(SAMPLE, {
      style: 'compact',
      invert: false,
      fgColor: '#ff0000',
    });
    expect(result).toContain('\x1b[38;2;255;0;0m');
    expect(result).toContain('\x1b[0m');
  });

  it('should handle odd number of rows in compact mode', () => {
    const oddMatrix: boolean[][] = [
      [true, false],
      [false, true],
      [true, true],
    ];
    const result = renderTerminal(oddMatrix, {
      style: 'compact',
      invert: false,
    });
    expect(result.split('\n').length).toBe(2);
  });

  it('should handle empty matrix', () => {
    const result = renderTerminal([], {
      style: 'compact',
      invert: false,
    });
    expect(result).toBe('');
  });
});
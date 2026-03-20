import { describe, it, expect } from 'vitest';
import { fgCode, bgCode, colorize, renderANSI, RESET } from '../src/renderers/ansi.js';

describe('fgCode', () => {
  it('should generate truecolor escape for hex', () => {
    expect(fgCode('#ff0000')).toBe('\x1b[38;2;255;0;0m');
  });

  it('should handle short hex (#f00)', () => {
    expect(fgCode('#f00')).toBe('\x1b[38;2;255;0;0m');
  });

  it('should generate 256-color escape for numbers', () => {
    expect(fgCode('196')).toBe('\x1b[38;5;196m');
  });

  it('should handle named colors', () => {
    expect(fgCode('red')).toBe('\x1b[31m');
    expect(fgCode('green')).toBe('\x1b[32m');
  });

  it('should return empty string for invalid input', () => {
    expect(fgCode('notacolor')).toBe('');
  });
});

describe('bgCode', () => {
  it('should generate truecolor background escape', () => {
    expect(bgCode('#00ff00')).toBe('\x1b[48;2;0;255;0m');
  });

  it('should generate 256-color background escape', () => {
    expect(bgCode('21')).toBe('\x1b[48;5;21m');
  });

  it('should handle named colors with +10 offset', () => {
    expect(bgCode('red')).toBe('\x1b[41m');
  });
});

describe('colorize', () => {
  it('should wrap text with color codes', () => {
    const result = colorize('hello', '#ff0000');
    expect(result).toContain('\x1b[38;2;255;0;0m');
    expect(result).toContain('hello');
    expect(result).toContain(RESET);
  });

  it('should return plain text when no colors given', () => {
    expect(colorize('hello')).toBe('hello');
  });

  it('should support fg + bg', () => {
    const result = colorize('test', 'red', 'blue');
    expect(result).toContain('\x1b[31m');
    expect(result).toContain('\x1b[44m');
  });
});

describe('renderANSI', () => {
  it('should render matrix with compact half-block chars', () => {
    const matrix: boolean[][] = [
      [true, false],
      [false, true],
    ];
    const result = renderANSI(matrix);
    expect(result).toContain('▀');
    expect(result).toContain('▄');
  });

  it('should include color codes when color is specified', () => {
    const matrix: boolean[][] = [[true]];
    const result = renderANSI(matrix, '#ff0000');
    expect(result).toContain('\x1b[38;2;255;0;0m');
  });

  it('should work without colors', () => {
    const matrix: boolean[][] = [[true, false]];
    const result = renderANSI(matrix);
    expect(result).not.toContain('\x1b[');
  });
});
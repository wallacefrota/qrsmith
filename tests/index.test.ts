import { describe, it, expect, vi } from 'vitest';
import { qr, print, withTheme } from '../src/index.js';

describe('qr()', () => {
  it('should return QRResult with all properties', () => {
    const result = qr('Hello');

    expect(result.text).toBeDefined();
    expect(typeof result.text).toBe('string');
    expect(result.matrix).toBeDefined();
    expect(result.matrixWithMargin).toBeDefined();
    expect(result.size).toBeGreaterThan(0);
    expect(result.version).toBeGreaterThanOrEqual(1);
    expect(result.errorCorrection).toBe('M');

    expect(typeof result.print).toBe('function');
    expect(typeof result.toSVG).toBe('function');
    expect(typeof result.toHTML).toBe('function');
    expect(typeof result.toBraille).toBe('function');
    expect(typeof result.toANSI).toBe('function');
  });

  it('should use default options', () => {
    const result = qr('test');
    expect(result.errorCorrection).toBe('M');
  });

  it('should accept all style options', () => {
    const styles = ['default', 'compact', 'braille', 'dots', 'blocks', 'rounded'] as const;
    for (const style of styles) {
      const result = qr('test', { style });
      expect(result.text.length).toBeGreaterThan(0);
    }
  });

  it('should accept all error correction levels', () => {
    const levels = ['L', 'M', 'Q', 'H'] as const;
    for (const errorCorrection of levels) {
      const result = qr('test', { errorCorrection });
      expect(result.errorCorrection).toBe(errorCorrection);
    }
  });

  it('should invert when requested', () => {
    const normal = qr('test', { invert: false });
    const inverted = qr('test', { invert: true });
    expect(normal.text).not.toBe(inverted.text);
  });

  it('should apply margin', () => {
    const m0 = qr('test', { margin: 0 });
    const m4 = qr('test', { margin: 4 });
    expect(m4.matrixWithMargin.length).toBeGreaterThan(m0.matrixWithMargin.length);
  });

  it('should apply colors', () => {
    const result = qr('test', { fgColor: '#ff0000', bgColor: '#0000ff' });
    expect(result.text).toContain('\x1b[');
  });

  it('print() should call console.log', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const result = qr('test');
    result.print();
    expect(spy).toHaveBeenCalledWith(result.text);
    spy.mockRestore();
  });

  it('toSVG() should return valid SVG', () => {
    const result = qr('test');
    const svg = result.toSVG();
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('toSVG() should accept options', () => {
    const result = qr('test');
    const svg = result.toSVG({ size: 512, rounded: true, fgColor: '#ff0000' });
    expect(svg).toContain('width="512"');
    expect(svg).toContain('<circle');
    expect(svg).toContain('#ff0000');
  });

  it('toHTML() should return valid HTML', () => {
    const result = qr('test');
    const html = result.toHTML();
    expect(html).toContain('<div');
  });

  it('toHTML() should accept options', () => {
    const result = qr('test');
    const html = result.toHTML({ pixelSize: 16, className: 'my-qr', useTable: true });
    expect(html).toContain('<table');
    expect(html).toContain('my-qr');
  });

  it('toBraille() should return braille string', () => {
    const result = qr('test');
    const braille = result.toBraille();
    expect(braille.length).toBeGreaterThan(0);
    // Verificar que contém caracteres braille (U+2800 range)
    const hasBraille = [...braille].some(
      (ch) => ch.codePointAt(0)! >= 0x2800 && ch.codePointAt(0)! <= 0x28ff
    );
    expect(hasBraille).toBe(true);
  });

  it('toANSI() should return colored string', () => {
    const result = qr('test');
    const ansi = result.toANSI('#ff0000');
    expect(ansi).toContain('\x1b[38;2;255;0;0m');
  });

  it('toANSI() should fallback to options colors', () => {
    const result = qr('test', { fgColor: '#00ff00' });
    const ansi = result.toANSI();
    expect(ansi).toContain('\x1b[38;2;0;255;0m');
  });
});

describe('print()', () => {
  it('should generate and print', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    print('Hello');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('withTheme()', () => {
  it('should apply theme settings', () => {
    const result = withTheme('neon', 'test');
    expect(result.text).toContain('\x1b['); // neon tem fgColor
  });

  it('should allow overriding theme options', () => {
    const result = withTheme('neon', 'test', { margin: 0 });
    const defaultResult = withTheme('neon', 'test');
    expect(result.matrixWithMargin.length).toBeLessThan(
      defaultResult.matrixWithMargin.length
    );
  });

  it('should fallback to default theme for unknown name', () => {
    const result = withTheme('nonexistent', 'test');
    expect(result.text.length).toBeGreaterThan(0);
  });
});

describe('exports', () => {
  it('should export all expected functions', async () => {
    const mod = await import('../src/index.js');

    // Funções principais
    expect(typeof mod.qr).toBe('function');
    expect(typeof mod.print).toBe('function');
    expect(typeof mod.withTheme).toBe('function');

    // Core
    expect(typeof mod.encode).toBe('function');
    expect(typeof mod.applyMargin).toBe('function');
    expect(typeof mod.invertMatrix).toBe('function');
    expect(typeof mod.rotateMatrix).toBe('function');
    expect(typeof mod.scaleMatrix).toBe('function');
    expect(typeof mod.countDarkModules).toBe('function');

    // Renderers
    expect(typeof mod.renderTerminal).toBe('function');
    expect(typeof mod.renderBraille).toBe('function');
    expect(typeof mod.renderSVG).toBe('function');
    expect(typeof mod.renderHTML).toBe('function');
    expect(typeof mod.renderANSI).toBe('function');
    expect(typeof mod.colorize).toBe('function');

    // Themes
    expect(typeof mod.getTheme).toBe('function');
    expect(typeof mod.listThemes).toBe('function');
    expect(typeof mod.createTheme).toBe('function');
    expect(mod.themes).toBeDefined();

    // Utils
    expect(typeof mod.detectTerminal).toBe('function');

    // Errors
    expect(typeof mod.QRSmithError).toBe('function');
    expect(typeof mod.QRDataError).toBe('function');

    // Default export
    expect(typeof mod.default).toBe('function');
  });
});
import { describe, it, expect } from 'vitest';
import { themes, getTheme, listThemes, createTheme } from '../src/themes/index.js';

describe('themes', () => {
  it('should have a default theme', () => {
    expect(themes['default']).toBeDefined();
    expect(themes['default']!.name).toBe('default');
  });

  it('should have all expected themes', () => {
    const expected = [
      'default', 'classic', 'minimal', 'braille',
      'dots', 'blocks', 'inverted', 'neon',
      'ocean', 'sunset', 'matrix', 'pink',
    ];
    for (const name of expected) {
      expect(themes[name]).toBeDefined();
    }
  });

  it('every theme should have required fields', () => {
    for (const [name, theme] of Object.entries(themes)) {
      expect(theme.name).toBe(name);
      expect(theme.style).toBeDefined();
      expect(typeof theme.invert).toBe('boolean');
      expect(typeof theme.margin).toBe('number');
    }
  });
});

describe('getTheme', () => {
  it('should return theme by name', () => {
    const theme = getTheme('neon');
    expect(theme.name).toBe('neon');
    expect(theme.fgColor).toBe('#39ff14');
  });

  it('should return default for unknown name', () => {
    const theme = getTheme('nonexistent');
    expect(theme.name).toBe('default');
  });
});

describe('listThemes', () => {
  it('should return array of theme names', () => {
    const names = listThemes();
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(0);
    expect(names).toContain('default');
    expect(names).toContain('neon');
  });
});

describe('createTheme', () => {
  it('should create theme with defaults', () => {
    const theme = createTheme({ name: 'custom' });
    expect(theme.name).toBe('custom');
    expect(theme.style).toBe('compact');
    expect(theme.margin).toBe(2);
    expect(theme.invert).toBe(false);
  });

  it('should allow overriding all fields', () => {
    const theme = createTheme({
      name: 'custom',
      style: 'braille',
      invert: true,
      margin: 0,
      fgColor: '#ff0000',
      bgColor: '#000000',
    });
    expect(theme.style).toBe('braille');
    expect(theme.invert).toBe(true);
    expect(theme.margin).toBe(0);
    expect(theme.fgColor).toBe('#ff0000');
  });
});
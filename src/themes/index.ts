import type { Theme } from '../types';

/**
 * Temas pre defined
 */
export const themes: Record<string, Theme> = {
  default: {
    name: 'default',
    style: 'compact',
    invert: false,
    margin: 2,
  },

  classic: {
    name: 'classic',
    style: 'default',
    invert: false,
    margin: 2,
  },

  minimal: {
    name: 'minimal',
    style: 'compact',
    invert: false,
    margin: 1,
  },

  braille: {
    name: 'braille',
    style: 'braille',
    invert: false,
    margin: 2,
  },

  dots: {
    name: 'dots',
    style: 'dots',
    invert: false,
    margin: 2,
  },

  blocks: {
    name: 'blocks',
    style: 'blocks',
    invert: false,
    margin: 2,
  },

  inverted: {
    name: 'inverted',
    style: 'compact',
    invert: true,
    margin: 2,
  },

  neon: {
    name: 'neon',
    style: 'compact',
    invert: false,
    fgColor: '#39ff14',
    margin: 2,
  },

  ocean: {
    name: 'ocean',
    style: 'compact',
    invert: false,
    fgColor: '#00d4ff',
    bgColor: '#0a0a2e',
    margin: 2,
  },

  sunset: {
    name: 'sunset',
    style: 'compact',
    invert: false,
    fgColor: '#ff6b35',
    bgColor: '#1a0a2e',
    margin: 2,
  },

  matrix: {
    name: 'matrix',
    style: 'braille',
    invert: false,
    fgColor: '#00ff41',
    margin: 1,
  },

  pink: {
    name: 'pink',
    style: 'compact',
    invert: false,
    fgColor: '#ff69b4',
    margin: 2,
  },
};

/**
* Returns a theme by name. Returns 'default' if not found.
*/
export function getTheme(name: string): Theme {
  return themes[name] ?? themes['default']!;
}

/**
* Lists all available theme names
*/
export function listThemes(): string[] {
  return Object.keys(themes);
}

/**
* Creates a custom theme
*/
export function createTheme(overrides: Partial<Theme> & { name: string }): Theme {
  return {
    style: 'compact',
    invert: false,
    margin: 2,
    ...overrides,
  };
}
/**
* Converts a color (hex or ANSI 256) into foreground escape code
*/
export function fgCode(color: string): string {
  if (color.startsWith('#')) {
    const { r, g, b } = hexToRgb(color);
    return `\x1b[38;2;${r};${g};${b}m`;
  }

  const num = parseInt(color, 10);
  if (!isNaN(num) && num >= 0 && num <= 255) {
    return `\x1b[38;5;${num}m`;
  }

  // Basic named colors
  const named = NAMED_COLORS[color.toLowerCase()];
  if (named !== undefined) {
    return `\x1b[${named}m`;
  }

  return '';
}

/**
* Converts a color (hex or ANSI 256) into background escape code
*/
export function bgCode(color: string): string {
  if (color.startsWith('#')) {
    const { r, g, b } = hexToRgb(color);
    return `\x1b[48;2;${r};${g};${b}m`;
  }

  const num = parseInt(color, 10);
  if (!isNaN(num) && num >= 0 && num <= 255) {
    return `\x1b[48;5;${num}m`;
  }

  const named = NAMED_COLORS[color.toLowerCase()];
  if (named !== undefined) {
    return `\x1b[${named + 10}m`;
  }

  return '';
}

/** Reset all colors and styles */
export const RESET = '\x1b[0m';

/** Bold */
export const BOLD = '\x1b[1m';

/** Dim */
export const DIM = '\x1b[2m';

/**
* Encloses a string with foreground color and reset
*/
export function colorize(text: string, fg?: string, bg?: string): string {
  const prefix = (fg ? fgCode(fg) : '') + (bg ? bgCode(bg) : '');
  if (!prefix) return text;
  return prefix + text + RESET;
}

/**
* Renders a QR matrix as a colored ANSI string (compact mode ▀▄█)
*/
export function renderANSI(
  matrix: boolean[][],
  fgColor?: string,
  bgColor?: string
): string {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const lines: string[] = [];

  const fg = fgColor ? fgCode(fgColor) : '';
  const bg = bgColor ? bgCode(bgColor) : '';
  const prefix = fg + bg;
  const suffix = (fg || bg) ? RESET : '';

  for (let r = 0; r < rows; r += 2) {
    let line = prefix;
    for (let c = 0; c < cols; c++) {
      const top = matrix[r]?.[c] ?? false;
      const bottom = matrix[r + 1]?.[c] ?? false;

      if (top && bottom) line += '█';
      else if (top) line += '▀';
      else if (bottom) line += '▄';
      else line += ' ';
    }
    line += suffix;
    lines.push(line);
  }

  return lines.join('\n');
}

// ── Helpers internals ──

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB {
  const cleaned = hex.replace('#', '');

  let fullHex = cleaned;
  if (cleaned.length === 3) {
    fullHex = cleaned[0]! + cleaned[0]! + cleaned[1]! + cleaned[1]! + cleaned[2]! + cleaned[2]!;
  }

  const num = parseInt(fullHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

const NAMED_COLORS: Record<string, number> = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  gray: 90,
  grey: 90,
};
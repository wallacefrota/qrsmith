import type { RenderStyle } from '../types';
import { invertMatrix } from '../core/matrix';
import { fgCode, bgCode, RESET } from './ansi';
import { renderBraille } from './braille';

// ──────────────────────────────────────────────
// Internal renderer options
// ──────────────────────────────────────────────
export interface TerminalRenderOptions {
  style: RenderStyle;
  invert: boolean;
  fgColor?: string;
  bgColor?: string;
  maxWidth?: number;
}

// ──────────────────────────────────────────────
// Charsets per styles
// ──────────────────────────────────────────────
const HALF_BLOCK = {
  both: '█',
  top: '▀',
  bottom: '▄',
  none: ' ',
} as const;

const DOTS_CHARS = {
  both: '⣿',
  top: '⠛',
  bottom: '⣤',
  none: ' ',
} as const;

// ──────────────────────────────────────────────
// Entry point from the terminal renderer
// ──────────────────────────────────────────────
export function renderTerminal(
  matrix: boolean[][],
  opts: TerminalRenderOptions
): string {
  const m = opts.invert ? invertMatrix(matrix) : matrix;

  switch (opts.style) {
    case 'compact':
      return renderHalfBlock(m, HALF_BLOCK, opts);

    case 'braille':
      return renderBraille(m);

    case 'dots':
      return renderHalfBlock(m, DOTS_CHARS, opts);

    case 'blocks':
      return renderFullWidth(m, '⬛', '⬜', opts);

    case 'rounded':
      return renderFullWidth(m, '● ', '  ', opts);

    case 'default':
    default:
      return renderFullWidth(m, '██', '  ', opts);
  }
}

// ──────────────────────────────────────────────
// FULL mode: each module = 1 line high
// ──────────────────────────────────────────────
function renderFullWidth(
  matrix: boolean[][],
  darkChar: string,
  lightChar: string,
  opts: TerminalRenderOptions
): string {
  const lines: string[] = [];

  const fg = opts.fgColor ? fgCode(opts.fgColor) : '';
  const bg = opts.bgColor ? bgCode(opts.bgColor) : '';
  const prefix = fg + bg;
  const suffix = prefix ? RESET : '';

  for (const row of matrix) {
    let line = prefix;
    for (const cell of row) {
      line += cell ? darkChar : lightChar;
    }
    line += suffix;
    lines.push(line);
  }

  return lines.join('\n');
}

// ──────────────────────────────────────────────
// HALF BLOCK mode: 2 lines compressed into 1
// ──────────────────────────────────────────────
interface HalfBlockChars {
  readonly both: string;
  readonly top: string;
  readonly bottom: string;
  readonly none: string;
}

function renderHalfBlock(
  matrix: boolean[][],
  chars: HalfBlockChars,
  opts: TerminalRenderOptions
): string {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const lines: string[] = [];

  const fg = opts.fgColor ? fgCode(opts.fgColor) : '';
  const bg = opts.bgColor ? bgCode(opts.bgColor) : '';
  const prefix = fg + bg;
  const suffix = prefix ? RESET : '';

  for (let r = 0; r < rows; r += 2) {
    let line = prefix;
    for (let c = 0; c < cols; c++) {
      const top = matrix[r]?.[c] ?? false;
      const bottom = matrix[r + 1]?.[c] ?? false;

      if (top && bottom) line += chars.both;
      else if (top) line += chars.top;
      else if (bottom) line += chars.bottom;
      else line += chars.none;
    }
    line += suffix;
    lines.push(line);
  }

  return lines.join('\n');
}
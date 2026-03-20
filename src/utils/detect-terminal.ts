import type { TerminalCapabilities } from '../types.js';

/**
* Detects the capabilities of the current terminal
*/
export function detectTerminal(): TerminalCapabilities {
  const columns = getColumns();
  const rows = getRows();
  const trueColor = supportsTrueColor();
  const color256 = supportsColor256();
  const unicode = supportsUnicode();

  return { columns, rows, trueColor, color256, unicode };
}

/**
* Returns the terminal width in columns
*/
export function getColumns(): number {
  if (typeof process !== 'undefined' && process.stdout?.columns) {
    return process.stdout.columns;
  }
  return 80; // fallback default
}

/**
* Returns the terminal height in lines
*/
export function getRows(): number {
  if (typeof process !== 'undefined' && process.stdout?.rows) {
    return process.stdout.rows;
  }
  return 24;
}

/**
* Detects TrueColor (24-bit) support in the terminal
*/
export function supportsTrueColor(): boolean {
  if (typeof process === 'undefined') return false;

  const env = process.env;

  if (env['COLORTERM'] === 'truecolor' || env['COLORTERM'] === '24bit') {
    return true;
  }

  const term = env['TERM'] ?? '';
  const termProgram = env['TERM_PROGRAM'] ?? '';

  if (termProgram === 'iTerm.app') return true;
  if (termProgram === 'Hyper') return true;
  if (term.includes('256color')) return true;
  if (env['WT_SESSION']) return true; // Windows Terminal

  return false;
}

/**
 * Detects 256 color support
 */
export function supportsColor256(): boolean {
  if (typeof process === 'undefined') return false;

  const term = process.env['TERM'] ?? '';
  if (term.includes('256color')) return true;
  if (supportsTrueColor()) return true;

  return false;
}

/**
 * Detects Unicode support.
 */
export function supportsUnicode(): boolean {
  if (typeof process === 'undefined') return true;

  const lang = process.env['LANG'] ?? '';
  const lcAll = process.env['LC_ALL'] ?? '';

  if (lang.includes('UTF-8') || lang.includes('utf-8')) return true;
  if (lcAll.includes('UTF-8') || lcAll.includes('utf-8')) return true;

  // Windows 10+ generally supports
  if (process.platform === 'win32') return true;

  return true; // to provide support in modern environments
}
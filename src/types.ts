// ──────────────────────────────────────────────
// QR Code Error Correction Levels
// ─────────────────────── ───────────────────────
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

// ──────────────────────────────────────────────
// Rendering styles in the terminal
// ─────────────────────────────────────────────
export type RenderStyle =
  | 'default' // ██ per module (2 chars width, 1 line height)
  | 'compact' // ▀▄█ — 2 lines compressed into 1
  | 'braille' // ⠿⣿ — 4 lines x 2 columns per character
  | 'dots' // ● per module
  | 'blocks' // ⬛⬜ emoji blocks
  | 'rounded'; // ● rounded dots

// ──────────────────────────────────────────────
// Options for generating the QR code
// ─────────────────────────────────────────────
export interface QROptions {

  /** Error correction level (default: 'M') */
  errorCorrection?: ErrorCorrectionLevel;

  /** Rendering style in the terminal (default: 'compact') */
  style?: RenderStyle;

  /** Margin around the QR code in modules (default: 2) */
  margin?: number;

  /** Invert colors — ideal for terminals with light backgrounds (default: false) */

  invert?: boolean;

  /** Foreground color. Hex (#ff0000) or ANSI 256 (196) */
  fgColor?: string;

  /** Background color. Hex (#ffffff) or ANSI 256 (15) */
  bgColor?: string;

  /** Maximum terminal width in characters. Auto-detects if omitted */
  maxWidth?: number;

}

// ──────────────────────────────────────────────
// Options for SVG rendering
// ─────────────────────── ───────────────────────
export interface SVGOptions {
  /** Size in pixels of the SVG (default: 256) */
  size?: number;

  /** Foreground color (default: '#000000') */
  fgColor?: string;

  /** Background color (default: '#ffffff') */
  bgColor?: string;

  /** Modules with rounded corners (default: false) */
  rounded?: boolean;

  /** Margin in modules (default: uses QROptions margin) */
  margin?: number;

}

// ──────────────────────────────────────────────
// Options for HTML rendering
// ─────────────────────────────────────────────
export interface HTMLOptions {

  /** Size of each module in pixels (default: 8) */

  pixelSize?: number;

  /** CSS class of the container (default: 'qrsmith') */

  className?: string;

  /** Foreground color (default: '#000000') */

  fgColor?: string;

  /** Background color (default: '#ffffff') */

  bgColor?: string;

  /** Margin in modules (default: uses QROptions margin) */
  margin?: number;

  /** Use table instead of divs (default: false) */
  useTable?: boolean;

}

// ──────────────────────────────────────────────
// Theme — visual options preset
// ─────────────────────── ───────────────────────
export interface Theme {
  name: string;
  style: RenderStyle;
  invert: boolean;
  fgColor?: string;
  bgColor?: string;
  margin: number;
}

// ──────────────────────────────────────────────
// QR code generation result
// ─────────────────────────────────────────────
export interface QRResult {

  /** Rendered string ready for the terminal */

  text: string;

  /** Raw boolean array (true = dark module) */

  matrix: boolean[][];

  /** Array with margin applied */

  matrixWithMargin: boolean[][];

  /** Size of the array without margin (in modules) */

  size: number;

  /** QR code version used (1-40) */

  version: number;

  /** Error correction level used */
  errorCorrection: ErrorCorrectionLevel;

  /** Prints the QR code to stdout */
  print(): void;

  /** Returns an SVG string */
  toSVG(options?: SVGOptions): string;

  /** Returns an HTML string */
  toHTML(options?: HTMLOptions): string;

  /** Returns an ultra-compact Braille representation */
  toBraille(): string;

  /** Returns a string with ANSI colors */
  toANSI(fgColor?: string, bgColor?: string): string;

}

// ──────────────────────────────────────────────
// Detected terminal capabilities
// ─────────────────────────────────────────────
export interface TerminalCapabilities {

  /** Width in columns */
  columns: number;

  /** Height in rows */
  rows: number;

  /** Supports true color (24-bit) */
  trueColor: boolean;

  /** Supports 256 colors */
  color256: boolean;

  /** Supports Unicode */
  unicode: boolean;
}
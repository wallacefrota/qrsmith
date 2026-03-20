import { encode } from './core/encoder';
import { applyMargin, invertMatrix } from './core/matrix';
import { renderTerminal } from './renderers/terminal';
import { renderSVG } from './renderers/svg';
import { renderHTML } from './renderers/html';
import { renderBraille } from './renderers/braille';
import { renderANSI } from './renderers/ansi';
import { getTheme } from './themes/index';
import type {
  QROptions,
  QRResult,
  SVGOptions,
  HTMLOptions
} from './types';

/**
* Generates a QR code from a string.
*
* @example
* ```ts
* import { qr } from 'qrsmith';
*
* // Generates and prints
* qr('https://example.com').print();
*
* // With options
* const result = qr('Hello', { style: 'braille', invert: true });
* console.log(result.text);
*
* // Export SVG
* const svg = qr('data').toSVG({ size: 512, rounded: true });
* ```
*/

export function qr(data: string, options: QROptions = {}): QRResult {
  const {
    errorCorrection = 'M',
    style = 'compact',
    margin = 2,
    invert = false,
    fgColor,
    bgColor,
    maxWidth,
  } = options;

  // Generates the matrix.
  const { matrix, version, size } = encode(data, errorCorrection);

  // Applies margin
  const matrixWithMargin = applyMargin(matrix, margin);

  // Renders to terminal
  const text = renderTerminal(matrixWithMargin, {
    style,
    invert,
    fgColor,
    bgColor,
    maxWidth,
  });

  // Inverted matrix for use in auxiliary methods
  const matrixForBraille = invert ? invertMatrix(matrixWithMargin) : matrixWithMargin;

  return {
    text,
    matrix,
    matrixWithMargin,
    size,
    version,
    errorCorrection,

    print() {
      console.log(text);
    },

    toSVG(svgOpts?: SVGOptions) {
      return renderSVG(matrix, margin, svgOpts);
    },

    toHTML(htmlOpts?: HTMLOptions) {
      return renderHTML(matrix, margin, htmlOpts);
    },

    toBraille() {
      return renderBraille(matrixForBraille);
    },

    toANSI(fg?: string, bg?: string) {
      return renderANSI(matrixWithMargin, fg ?? fgColor, bg ?? bgColor);
    },
  };
}

/**
* Shortcut: Generates and prints directly to the console
*/ export function print(data: string, options?: QROptions): void {
  qr(data, options).print();
}
/**
* Generates using a predefined theme
*
* @example
* ```ts
* import { withTheme } from 'qrsmith';
* withTheme('neon', 'https://example.com').print();
* ```
*/
export function withTheme(
  themeName: string,
  data: string,
  overrides: Partial<QROptions> = {}
): QRResult {
  const theme = getTheme(themeName);

  return qr(data, {
    style: theme.style,
    invert: theme.invert,
    fgColor: theme.fgColor,
    bgColor: theme.bgColor,
    margin: theme.margin,
    ...overrides,
  });
}

// ── Re-exports ──
export { encode } from './core/encoder';
export { applyMargin, invertMatrix, rotateMatrix, scaleMatrix, countDarkModules } from './core/matrix';
export { renderTerminal } from './renderers/terminal';
export { renderBraille } from './renderers/braille';
export { renderSVG } from './renderers/svg';
export { renderHTML } from './renderers/html';
export { renderANSI, colorize, fgCode, bgCode } from './renderers/ansi';
export { themes, getTheme, listThemes, createTheme } from './themes/index';
export { detectTerminal } from './utils/detect-terminal';
export { QRSmithError, QRDataError, QRRenderError, QROptionError } from './errors';

// ── Types ──
export type {
  QROptions,
  QRResult,
  SVGOptions,
  HTMLOptions,
  ErrorCorrectionLevel,
  RenderStyle,
  Theme,
  TerminalCapabilities,
} from './types';

// ── Default export ──
export default qr;
import type { SVGOptions } from '../types';
import { applyMargin } from '../core/matrix';

/**
* Renders a QR matrix as a complete SVG string
*/
export function renderSVG(
  matrix: boolean[][],
  defaultMargin: number,
  options: SVGOptions = {}
): string {
  const {
    size: svgSize = 256,
    fgColor = '#000000',
    bgColor = '#ffffff',
    rounded = false,
    margin = defaultMargin,
  } = options;

  const matrixWithMargin = applyMargin(matrix, margin);
  const moduleCount = matrixWithMargin.length;
  const cellSize = svgSize / moduleCount;

  const elements: string[] = [];

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (!matrixWithMargin[r]![c]) continue;

      const x = c * cellSize;
      const y = r * cellSize;

      if (rounded) {
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        const radius = cellSize * 0.42;
        elements.push(
          `    <circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(radius)}" fill="${fgColor}"/>`
        );
      } else {
        elements.push(
          `    <rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(cellSize)}" height="${fmt(cellSize)}" fill="${fgColor}"/>`
        );
      }
    }
  }

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}" shape-rendering="crispEdges">`,
    `  <rect width="100%" height="100%" fill="${bgColor}"/>`,
    `  <g>`,
    ...elements,
    `  </g>`,
    `</svg>`,
  ].join('\n');
}

/**
 * Formats a number with a maximum of 4 decimal places, without trailing zeros.
 */
function fmt(n: number): string {
  return parseFloat(n.toFixed(4)).toString();
}
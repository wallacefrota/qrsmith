import type { HTMLOptions } from '../types';
import { applyMargin } from '../core/matrix';

/**
* Renders a QR array as an HTML string (div-based or table-based)
*/
export function renderHTML(
  matrix: boolean[][],
  defaultMargin: number,
  options: HTMLOptions = {}
): string {
  const {
    pixelSize = 8,
    className = 'qrsmith',
    fgColor = '#000000',
    bgColor = '#ffffff',
    margin = defaultMargin,
    useTable = false,
  } = options;

  const matrixWithMargin = applyMargin(matrix, margin);
  const moduleCount = matrixWithMargin.length;
  const totalSize = moduleCount * pixelSize;

  if (useTable) {
    return renderAsTable(matrixWithMargin, pixelSize, className, fgColor, bgColor, totalSize);
  }

  return renderAsDivs(matrixWithMargin, pixelSize, className, fgColor, bgColor, totalSize);
}

function renderAsDivs(
  matrix: boolean[][],
  pixelSize: number,
  className: string,
  fgColor: string,
  bgColor: string,
  totalSize: number
): string {
  const lines: string[] = [];

  lines.push(`<div class="${className}" style="display:inline-block;background:${bgColor};padding:0;line-height:0;">`);

  for (const row of matrix) {
    lines.push(`  <div style="height:${pixelSize}px;white-space:nowrap;">`);
    for (const cell of row) {
      const color = cell ? fgColor : bgColor;
      lines.push(
        `    <div style="display:inline-block;width:${pixelSize}px;height:${pixelSize}px;background:${color};"></div>`
      );
    }
    lines.push(`  </div>`);
  }

  lines.push(`</div>`);

  // Embedded CSS for clean styling
  lines.push(`<style>`);
  lines.push(`.${className} { image-rendering: pixelated; width: ${totalSize}px; }`);
  lines.push(`</style>`);

  return lines.join('\n');
}

function renderAsTable(
  matrix: boolean[][],
  pixelSize: number,
  className: string,
  fgColor: string,
  bgColor: string,
  _totalSize: number
): string {
  const lines: string[] = [];

  lines.push(
    `<table class="${className}" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:${bgColor};">`
  );

  for (const row of matrix) {
    lines.push(`  <tr>`);
    for (const cell of row) {
      const color = cell ? fgColor : bgColor;
      lines.push(
        `    <td style="width:${pixelSize}px;height:${pixelSize}px;background:${color};padding:0;"></td>`
      );
    }
    lines.push(`  </tr>`);
  }

  lines.push(`</table>`);

  return lines.join('\n');
}
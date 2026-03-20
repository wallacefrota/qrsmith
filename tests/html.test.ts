import { describe, it, expect } from 'vitest';
import { renderHTML } from '../src/renderers/html.js';

const SAMPLE: boolean[][] = [
  [true, false],
  [false, true],
];

describe('renderHTML', () => {
  it('should return valid HTML with divs by default', () => {
    const html = renderHTML(SAMPLE, 1);
    expect(html).toContain('<div');
    expect(html).toContain('</div>');
  });

  it('should use specified className', () => {
    const html = renderHTML(SAMPLE, 0, { className: 'my-qr' });
    expect(html).toContain('class="my-qr"');
  });

  it('should use specified pixel size', () => {
    const html = renderHTML(SAMPLE, 0, { pixelSize: 16 });
    expect(html).toContain('width:16px');
    expect(html).toContain('height:16px');
  });

  it('should use specified colors', () => {
    const html = renderHTML(SAMPLE, 0, {
      fgColor: '#ff0000',
      bgColor: '#00ff00',
    });
    expect(html).toContain('#ff0000');
    expect(html).toContain('#00ff00');
  });

  it('should render as table when useTable is true', () => {
    const html = renderHTML(SAMPLE, 0, { useTable: true });
    expect(html).toContain('<table');
    expect(html).toContain('<td');
    expect(html).toContain('</table>');
  });

  it('should include style tag', () => {
    const html = renderHTML(SAMPLE, 0);
    expect(html).toContain('<style>');
  });

  it('should handle empty matrix', () => {
    const html = renderHTML([], 0);
    expect(html).toContain('<div');
  });
});
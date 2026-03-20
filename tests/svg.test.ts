import { describe, it, expect } from 'vitest';
import { renderSVG } from '../src/renderers/svg.js';

const SAMPLE: boolean[][] = [
  [true, false],
  [false, true],
];

describe('renderSVG', () => {
  it('should return valid SVG string', () => {
    const svg = renderSVG(SAMPLE, 1);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it('should contain xml declaration', () => {
    const svg = renderSVG(SAMPLE, 1);
    expect(svg).toContain('<?xml version="1.0"');
  });

  it('should contain rect elements for dark modules', () => {
    const svg = renderSVG(SAMPLE, 0);
    expect(svg).toContain('<rect');
  });

  it('should use default colors', () => {
    const svg = renderSVG(SAMPLE, 1);
    expect(svg).toContain('#000000');
    expect(svg).toContain('#ffffff');
  });

  it('should accept custom colors', () => {
    const svg = renderSVG(SAMPLE, 1, {
      fgColor: '#ff0000',
      bgColor: '#0000ff',
    });
    expect(svg).toContain('#ff0000');
    expect(svg).toContain('#0000ff');
  });

  it('should accept custom size', () => {
    const svg = renderSVG(SAMPLE, 1, { size: 512 });
    expect(svg).toContain('width="512"');
    expect(svg).toContain('height="512"');
  });

  it('should render circles when rounded is true', () => {
    const svg = renderSVG(SAMPLE, 0, { rounded: true });
    expect(svg).toContain('<circle');
    expect(svg).not.toContain('<rect x=');
  });

  it('should include background rect', () => {
    const svg = renderSVG(SAMPLE, 0);
    expect(svg).toContain('width="100%"');
    expect(svg).toContain('height="100%"');
  });

  it('should handle empty matrix', () => {
    const svg = renderSVG([], 1);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('should apply margin', () => {
    const noMargin = renderSVG(SAMPLE, 0);
    const withMargin = renderSVG(SAMPLE, 2);
    // Com margem, o viewBox é o mesmo mas as posições dos rects mudam
    expect(noMargin).not.toBe(withMargin);
  });
});
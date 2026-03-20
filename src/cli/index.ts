import { qr, withTheme, listThemes } from '../index.js';
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    style: {
      type: 'string',
      short: 's',
      default: 'compact',
    },
    error: {
      type: 'string',
      short: 'e',
      default: 'M',
    },
    invert: {
      type: 'boolean',
      short: 'i',
      default: false,
    },
    margin: {
      type: 'string',
      short: 'm',
      default: '2',
    },
    color: {
      type: 'string',
      short: 'c',
    },
    bg: {
      type: 'string',
    },
    theme: {
      type: 'string',
      short: 't',
    },
    'list-themes': {
      type: 'boolean',
      default: false,
    },
    svg: {
      type: 'boolean',
      default: false,
    },
    'svg-size': {
      type: 'string',
      default: '256',
    },
    'svg-rounded': {
      type: 'boolean',
      default: false,
    },
    html: {
      type: 'boolean',
      default: false,
    },
    'html-size': {
      type: 'string',
      default: '8',
    },
    braille: {
      type: 'boolean',
      short: 'b',
      default: false,
    },
    help: {
      type: 'boolean',
      short: 'h',
      default: false,
    },
    version: {
      type: 'boolean',
      short: 'v',
      default: false,
    },
  },
});

// ── Help ──
if (values.help) {
  console.log(`
  ${bold('qrsmith')} — Beautiful QR codes in your terminal

  ${bold('USAGE')}
    qrsmith [options] <data>
    echo "data" | qrsmith [options]

  ${bold('OPTIONS')}
    -s, --style <style>     Render style (default: compact)
                            Styles: default, compact, braille, dots, blocks, rounded
    -e, --error <level>     Error correction: L, M, Q, H (default: M)
    -i, --invert            Invert colors (for light terminals)
    -m, --margin <n>        Quiet zone margin in modules (default: 2)
    -c, --color <color>     Foreground color (hex: #ff0000 or ansi: 196)
        --bg <color>        Background color
    -t, --theme <name>      Use a preset theme
        --list-themes       List available themes
    -b, --braille           Shortcut for --style braille

  ${bold('OUTPUT FORMATS')}
        --svg               Output SVG to stdout
        --svg-size <px>     SVG size in pixels (default: 256)
        --svg-rounded       SVG with rounded modules
        --html              Output HTML to stdout
        --html-size <px>    HTML module size in pixels (default: 8)

  ${bold('INFO')}
    -h, --help              Show this help
    -v, --version           Show version

  ${bold('EXAMPLES')}
    qrsmith "https://example.com"
    qrsmith -s braille "Hello World"
    qrsmith -i -c "#00ff00" "https://github.com"
    qrsmith -t neon "data"
    qrsmith --svg "data" > qrcode.svg
    qrsmith --html "data" > qrcode.html
    echo "piped data" | qrsmith
    cat urls.txt | head -1 | qrsmith
`);
  process.exit(0);
}

// ── Version ──
if (values.version) {
  try {
    const pkgPath = new URL('../../package.json', import.meta.url);
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    console.log(pkg.version);
  } catch {
    console.log('1.0.0');
  }
  process.exit(0);
}

// ── List themes ──
if (values['list-themes']) {
  console.log('\nAvailable themes:\n');
  for (const name of listThemes()) {
    console.log(`  • ${name}`);
  }
  console.log('');
  process.exit(0);
}

let data = positionals[0];

if (!data && !process.stdin.isTTY) {
  try {
    data = readFileSync(0, 'utf-8').trim();
  } catch {
    // stdin empty
  }
}

if (!data) {
  console.error('Error: No data provided. Use --help for usage.');
  process.exit(1);
}

// ── Resolve style ──
let style = values.style as string;
if (values.braille) {
  style = 'braille';
}

// ── Generate and renderize ──
try {
  if (values.theme) {
    // theme mode
    const result = withTheme(values.theme, data, {
      style: style as any,
      errorCorrection: values.error as any,
      invert: values.invert,
      margin: parseInt(values.margin!, 10),
      fgColor: values.color,
      bgColor: values.bg,
    });

    outputResult(result);
  } else {
    // normal mode
    const result = qr(data, {
      style: style as any,
      errorCorrection: values.error as any,
      invert: values.invert,
      margin: parseInt(values.margin!, 10),
      fgColor: values.color,
      bgColor: values.bg,
    });

    outputResult(result);
  }
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Error: ${message}`);
  process.exit(1);
}

// ── Helpers ──

function outputResult(result: ReturnType<typeof qr>) {
  if (values.svg) {
    console.log(
      result.toSVG({
        size: parseInt(values['svg-size']!, 10),
        rounded: values['svg-rounded'],
      })
    );
  } else if (values.html) {
    console.log(
      result.toHTML({
        pixelSize: parseInt(values['html-size']!, 10),
      })
    );
  } else {
    result.print();
  }
}

function bold(text: string): string {
  return `\x1b[1m${text}\x1b[0m`;
}
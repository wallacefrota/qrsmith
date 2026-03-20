# 🔳 qrsmith

Beautiful QR codes in your terminal — compact, colorful, and versatile.

## Install

```bash
npm install qrsmith

# Global CLI
npm install -g qrsmith
```

## Quick Start

```typescript
import { qr } from "qrsmith";

// Generate and print
qr("https://example.com").print();

// Compact (default) — half the height using ▀▄█
qr("Hello World", { style: "compact" }).print();

// Ultra-compact braille — 8x denser
qr("Hello World", { style: "braille" }).print();

// With colors
qr("https://github.com", {
  fgColor: "#ff6b35",
  bgColor: "#1a0a2e",
}).print();

// Inverted for light terminals
qr("data", { invert: true }).print();
```

## Render Styles

| Style     | Description        | Density |
| --------- | ------------------ | ------- |
| `default` | `██` per module    | 1x      |
| `compact` | `▀▄█` half-block   | 2x      |
| `braille` | `⣿⠛⣤` braille dots | 8x      |
| `dots`    | Dot pattern        | 2x      |
| `blocks`  | `⬛⬜` emoji       | 1x      |
| `rounded` | `● ` circles       | 1x      |

## Export Formats

```typescript
const result = qr("data");

// SVG
const svg = result.toSVG({ size: 512, rounded: true });

// HTML
const html = result.toHTML({ pixelSize: 12, useTable: true });

// Braille string
const braille = result.toBraille();

// ANSI colored string
const ansi = result.toANSI("#ff0000", "#000000");

// Raw matrix
console.log(result.matrix); // boolean[][]
console.log(result.version); // 1-40
console.log(result.size); // module count
```

## Themes

```typescript
import { withTheme, listThemes } from "qrsmith";

withTheme("neon", "https://example.com").print();
withTheme("ocean", "data").print();
withTheme("matrix", "data").print();

console.log(listThemes());
// ['default', 'classic', 'minimal', 'braille', 'dots',
//  'blocks', 'inverted', 'neon', 'ocean', 'sunset', 'matrix', 'pink']
```

## CLI

```bash
# Basic
qrsmith "https://example.com"

# Braille mode
qrsmith -s braille "Hello World"

# Inverted with color
qrsmith -i -c "#00ff00" "https://github.com"

# Use a theme
qrsmith -t neon "data"

# Export SVG
qrsmith --svg "data" > qrcode.svg

# Export HTML
qrsmith --html "data" > qrcode.html

# Pipe support
echo "https://example.com" | qrsmith
cat url.txt | qrsmith -s braille

# List themes
qrsmith --list-themes
```

## API Reference

### `qr(data, options?): QRResult`

| Option            | Type                       | Default     | Description                    |
| ----------------- | -------------------------- | ----------- | ------------------------------ |
| `errorCorrection` | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'`       | Error correction level         |
| `style`           | `RenderStyle`              | `'compact'` | Terminal render style          |
| `margin`          | `number`                   | `2`         | Quiet zone margin              |
| `invert`          | `boolean`                  | `false`     | Invert dark/light              |
| `fgColor`         | `string`                   | —           | Foreground color (hex or ANSI) |
| `bgColor`         | `string`                   | —           | Background color               |
| `maxWidth`        | `number`                   | auto        | Max width in columns           |

### `QRResult`

| Property/Method     | Type          | Description              |
| ------------------- | ------------- | ------------------------ |
| `.text`             | `string`      | Rendered terminal string |
| `.matrix`           | `boolean[][]` | Raw QR matrix            |
| `.size`             | `number`      | Matrix size              |
| `.version`          | `number`      | QR version (1-40)        |
| `.print()`          | `void`        | Print to stdout          |
| `.toSVG(opts?)`     | `string`      | SVG output               |
| `.toHTML(opts?)`    | `string`      | HTML output              |
| `.toBraille()`      | `string`      | Braille output           |
| `.toANSI(fg?, bg?)` | `string`      | ANSI colored output      |

---

## 📄 License

Published under the [MIT](https://github.com/wallacefrota/qrsmith/blob/main/LICENSE) license. Made by [Wallace Frota](https://github.com/wallacefrota)

---

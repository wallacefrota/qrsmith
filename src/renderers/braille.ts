/**
* Offset table for Unicode Braille characters.
*
* Each Braille character encodes a 4×2 grid (4 rows, 2 columns):
*
* ⠁ (0x01) ⠈ (0x08)
* ⠂ (0x02) ⠐ (0x10)
* ⠄ (0x04) ⠠ (0x20)
* ⡀ (0x40) ⢀ (0x80)
*
* The base character is U+2800 (braille blank).
* We sum the offsets of the active dots to form the final character.
*/

const BRAILLE_BASE = 0x2800;

const BRAILLE_OFFSETS = [
  [0x01, 0x08], // row 0: dot1, dot4
  [0x02, 0x10], // row 1: dot2, dot5
  [0x04, 0x20], // row 2: dot3, dot6
  [0x40, 0x80], // row 3: dot7, dot8
] as const;

/**
* Renders a QR code matrix as Unicode Braille characters.
* Ultra-compact result: each character encodes 4×2 modules.
* A 21×21 QR code (version 1) fits in ~6 rows × ~11 columns.
*/
export function renderBraille(matrix: boolean[][]): string {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const lines: string[] = [];

  for (let r = 0; r < rows; r += 4) {
    let line = '';

    for (let c = 0; c < cols; c += 2) {
      let codePoint = BRAILLE_BASE;

      for (let dr = 0; dr < 4; dr++) {
        for (let dc = 0; dc < 2; dc++) {
          const mr = r + dr;
          const mc = c + dc;

          if (mr < rows && mc < cols && matrix[mr]![mc]) {
            codePoint += BRAILLE_OFFSETS[dr]![dc]!;
          }
        }
      }

      line += String.fromCodePoint(codePoint);
    }

    lines.push(line);
  }

  return lines.join('\n');
}
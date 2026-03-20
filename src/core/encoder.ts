import qrcodeGenerator from 'qrcode-generator';
import type { ErrorCorrectionLevel } from '../types';
import { QRDataError } from '../errors';

// qrcode-generator use internal number to EC levels

const VALID_EC_LEVELS: ErrorCorrectionLevel[] = ['L', 'M', 'Q', 'H'];

export interface EncodeResult {
  /** (true = dark) */
  matrix: boolean[][];

  /** Version of QR (1-40) */
  version: number;

  /** size matrix module */
  size: number;
}

/**
 * coder a string QR code
 */
export function encode(
  data: string,
  ecLevel: ErrorCorrectionLevel = 'M'
): EncodeResult {
  // ── Validation ──
  if (typeof data !== 'string') {
    throw new QRDataError('Data must be a string');
  }

  if (data.length === 0) {
    throw new QRDataError('Data must not be empty');
  }

  if (data.length > 4296) {
    throw new QRDataError(
      `Data too long: ${data.length} characters (max 4296 alphanumeric)`
    );
  }

  if (!VALID_EC_LEVELS.includes(ecLevel)) {
    throw new QRDataError(
      `Invalid error correction level: "${ecLevel}". Must be one of: L, M, Q, H`
    );
  }

  // ── generation ──
  // typeNumber = 0 → auto-detect
  const qr = qrcodeGenerator(0, ecLevel as ErrorCorrectionLevel);
  qr.addData(data);
  qr.make();

  const size = qr.getModuleCount();
  const matrix: boolean[][] = [];

  for (let row = 0; row < size; row++) {
    const rowData: boolean[] = [];
    for (let col = 0; col < size; col++) {
      rowData.push(qr.isDark(row, col));
    }
    matrix.push(rowData);
  }

  // derivated: size = 17 + version * 4
  const version = (size - 17) / 4;

  return { matrix, version, size };
}
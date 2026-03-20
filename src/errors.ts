export class QRSmithError extends Error {
  public readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'QRSmithError';
    this.code = code;
  }
}

export class QRDataError extends QRSmithError {
  constructor(message: string) {
    super(message, 'ERR_QR_DATA');
  }
}

export class QRRenderError extends QRSmithError {
  constructor(message: string) {
    super(message, 'ERR_QR_RENDER');
  }
}

export class QROptionError extends QRSmithError {
  constructor(message: string) {
    super(message, 'ERR_QR_OPTION');
  }
}
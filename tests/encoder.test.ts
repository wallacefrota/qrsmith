import { describe, it, expect } from 'vitest';
import { encode } from '../src/core/encoder.js';

describe('encode', () => {
  it('should encode a simple string', () => {
    const result = encode('Hello');
    expect(result.matrix).toBeDefined();
    expect(result.matrix.length).toBeGreaterThan(0);
    expect(result.size).toBe(result.matrix.length);
    expect(result.version).toBeGreaterThanOrEqual(1);
  });

  it('should produce a square matrix', () => {
    const result = encode('Test data');
    for (const row of result.matrix) {
      expect(row.length).toBe(result.size);
    }
  });

  it('should contain boolean values only', () => {
    const result = encode('https://example.com');
    for (const row of result.matrix) {
      for (const cell of row) {
        expect(typeof cell).toBe('boolean');
      }
    }
  });

  it('should respect error correction levels', () => {
    const resultL = encode('test', 'L');
    const resultH = encode('test', 'H');

    // Higher EC = larger QR (potentially)
    expect(resultL.size).toBeLessThanOrEqual(resultH.size);
  });

  it('should auto-detect version for short data', () => {
    const result = encode('Hi');
    expect(result.version).toBe(1); // Versão 1 para dados curtos
  });

  it('should use higher version for longer data', () => {
    const shortResult = encode('Hi');
    const longResult = encode('A'.repeat(100));
    expect(longResult.version).toBeGreaterThan(shortResult.version);
  });

  it('should throw on empty string', () => {
    expect(() => encode('')).toThrow('Data must not be empty');
  });

  it('should throw on non-string input', () => {
    expect(() => encode(42 as any)).toThrow('Data must be a string');
  });

  it('should throw on data too long', () => {
    expect(() => encode('A'.repeat(5000))).toThrow('Data too long');
  });

  it('should throw on invalid error correction level', () => {
    expect(() => encode('test', 'X' as any)).toThrow('Invalid error correction level');
  });

  it('should handle URLs', () => {
    const result = encode('https://github.com/user/repo?tab=readme');
    expect(result.matrix.length).toBeGreaterThan(0);
  });

  it('should handle special characters', () => {
    const result = encode('Hello! @#$%^&*()');
    expect(result.matrix.length).toBeGreaterThan(0);
  });

  it('should handle unicode text', () => {
    const result = encode('こんにちは');
    expect(result.matrix.length).toBeGreaterThan(0);
  });

  it('should have consistent size formula', () => {
    // size = 17 + version * 4
    const result = encode('test');
    expect(result.size).toBe(17 + result.version * 4);
  });
});
import { describe, it, expect, vi } from 'vitest';
import { validateFile } from './validation';

describe('validateFile', () => {
  it('should return null for valid files', () => {
    const files = [
      {
        file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        size: 1024 * 1024,
      },
      {
        file: new File([''], 'test.png', { type: 'image/png' }),
        size: 3 * 1024 * 1024,
      },
      {
        file: new File([''], 'test.gif', { type: 'image/gif' }),
        size: 4.9 * 1024 * 1024,
      },
    ];

    files.forEach(({ file, size }) => {
      vi.spyOn(file, 'size', 'get').mockReturnValue(size);
      expect(validateFile(file)).toBeNull();
    });
  });

  it('should return error for files that are too big', () => {
    const file = new File([''], 'big.jpg', { type: 'image/jpeg' });
    vi.spyOn(file, 'size', 'get').mockReturnValue(5.1 * 1024 * 1024);

    expect(validateFile(file)).toBe('File too big (max. 5MB)');
  });

  it('should return error for unsupported file formats', () => {
    const unsupportedFiles = [
      new File([''], 'test.txt', { type: 'text/plain' }),
      new File([''], 'test.pdf', { type: 'application/pdf' }),
      new File([''], 'test.webp', { type: 'image/webp' }),
      new File([''], 'test.bmp', { type: 'image/bmp' }),
    ];

    unsupportedFiles.forEach((file) => {
      vi.spyOn(file, 'size', 'get').mockReturnValue(1024);
      expect(validateFile(file)).toBe('Unsupported file format');
    });
  });

  it('should handle edge case of exactly 5MB file', () => {
    const file = new File([''], 'exact.jpg', { type: 'image/jpeg' });
    vi.spyOn(file, 'size', 'get').mockReturnValue(5 * 1024 * 1024);

    expect(validateFile(file)).toBeNull();
  });

  it('should handle zero size file with valid type', () => {
    const file = new File([''], 'empty.jpg', { type: 'image/jpeg' });
    vi.spyOn(file, 'size', 'get').mockReturnValue(0);

    expect(validateFile(file)).toBeNull();
  });
});

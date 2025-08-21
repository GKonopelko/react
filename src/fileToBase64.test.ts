import { it, expect, vi } from 'vitest';
import { fileToBase64 } from './fileToBase64';

class MockFileReader {
  readAsDataURL = vi.fn();
  onload: (() => void) | null = null;
  onerror: ((error: Error) => void) | null = null;
  result: string | null = null;
}

it('should convert file to base64 string', async () => {
  const mockFile = new File(['test content'], 'test.txt', {
    type: 'text/plain',
  });

  const mockReader = new MockFileReader();
  mockReader.result = 'data:image/jpeg;base64,test';

  vi.spyOn(global, 'FileReader').mockImplementation(
    () => mockReader as unknown as FileReader
  );

  const promise = fileToBase64(mockFile);

  mockReader.onload?.();

  const result = await promise;
  expect(result).toBe('data:image/jpeg;base64,test');
});

it('should reject on file read error', async () => {
  const mockFile = new File(['error'], 'error.txt', { type: 'text/plain' });

  const mockReader = new MockFileReader();
  vi.spyOn(global, 'FileReader').mockImplementation(
    () => mockReader as unknown as FileReader
  );

  const promise = fileToBase64(mockFile);

  const error = new Error('Read error');
  mockReader.onerror?.(error);

  await expect(promise).rejects.toThrow('Read error');
});

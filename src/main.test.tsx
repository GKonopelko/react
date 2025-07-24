import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('main', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    document.getElementById('root')?.remove();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw error if root does not exist', async () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null);
    vi.doMock('react-dom/client', () => ({
      createRoot: vi.fn(),
    }));

    await expect(import('./main')).rejects.toThrow(
      'Failed to find the root element'
    );
  });

  it('should render when root exists', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    const mockRender = vi.fn();
    vi.doMock('react-dom/client', () => ({
      createRoot: vi.fn(() => ({
        render: mockRender,
      })),
    }));

    await import('./main');

    const { createRoot } = await import('react-dom/client');
    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(createRoot).toHaveBeenCalledWith(root);
    expect(mockRender).toHaveBeenCalledTimes(1);

    document.body.removeChild(root);
  });
});

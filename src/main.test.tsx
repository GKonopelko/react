import { describe, it, expect, vi } from 'vitest';

describe('main.tsx', () => {
  it('should import successfully', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    vi.mock('react-dom/client', () => ({
      createRoot: vi.fn(() => ({ render: vi.fn() })),
    }));

    await expect(import('./main')).resolves.toBeDefined();

    document.body.removeChild(root);
  });
});

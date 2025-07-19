import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('*.png', () => ({
  default: '/test-image.png',
}));

vi.mock('*.svg', () => ({
  ReactComponent: () => 'svg-mock',
  default: '/test-image.svg',
}));

vi.mock('*.jpg', () => ({
  default: '/test-image.jpg',
}));

vi.mock('*.css', () => ({}));

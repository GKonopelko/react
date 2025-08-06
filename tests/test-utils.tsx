import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  renderHook,
  act,
  type RenderOptions,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export const createWrapper = () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
  wrapper.displayName = 'TestWrapper';
  return wrapper;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, {
    wrapper: createWrapper(),
    ...options,
  });
};

export { customRender as render, screen, fireEvent, waitFor, renderHook, act };

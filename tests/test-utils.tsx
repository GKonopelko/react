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

export const createWrapper = (initialEntries: string[] = ['/']) => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
  wrapper.displayName = 'TestWrapper';
  return wrapper;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string[] }
) => {
  return render(ui, {
    wrapper: createWrapper(options?.initialEntries),
    ...options,
  });
};

export { customRender as render, screen, fireEvent, waitFor, renderHook, act };

export const mockFetchResponse = (data: unknown, ok = true) => ({
  ok,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
});

export const mockFetchError = (error: Error) => {
  return Promise.reject(error);
};

export const mockFetchNetworkError = (status: number) => ({
  ok: false,
  status,
  json: () => Promise.resolve(null),
});

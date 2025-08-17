import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  searchPokemon,
  fetchPokemonDetails,
  fetchPokemonDetailsByUrl,
} from './api';
import { createPokemonDetails } from '../../tests/mocks';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Functions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('searchPokemon', () => {
    it('should fetch pokemon by name', async () => {
      const mockPokemon = createPokemonDetails(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemon),
      });

      const result = await searchPokemon('pikachu');
      expect(result).toEqual(mockPokemon);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/pikachu')
      );
    });

    it('should throw not found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.reject(new Error('Not found')),
      });

      await expect(searchPokemon('unknown')).rejects.toThrow(
        'Pokemon "unknown" not found'
      );
    });

    it('should throw server error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Server error')),
      });

      await expect(searchPokemon('pikachu')).rejects.toThrow('Server error');
    });

    it('should throw auth error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.reject(new Error('Auth error')),
      });

      await expect(searchPokemon('pikachu')).rejects.toThrow(
        'Authentication required'
      );
    });
  });

  describe('fetchPokemonDetails', () => {
    it('should fetch pokemon details by id', async () => {
      const mockPokemon = createPokemonDetails(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemon),
      });

      const result = await fetchPokemonDetails('1');
      expect(result).toEqual(mockPokemon);
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/1'));
    });

    it('should throw error for invalid id', async () => {
      await expect(fetchPokemonDetails('invalid')).rejects.toThrow(
        'Invalid Pokemon ID'
      );
    });

    it('should throw error when pokemon not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.reject(new Error('Not found')),
      });

      await expect(fetchPokemonDetails('999')).rejects.toThrow(
        'Pokemon not found'
      );
    });
  });

  describe('fetchPokemonDetailsByUrl', () => {
    it('should fetch pokemon details by url', async () => {
      const mockPokemon = createPokemonDetails(1);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemon),
      });

      const result = await fetchPokemonDetailsByUrl(`${BASE_URL}/1`);
      expect(result).toEqual(mockPokemon);
    });

    it('should return null when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.reject(new Error('Not found')),
      });

      const result = await fetchPokemonDetailsByUrl(`${BASE_URL}/999`);
      expect(result).toBeNull();
    });
  });
});

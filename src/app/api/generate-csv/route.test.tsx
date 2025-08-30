import { POST } from './route';
import { stringify } from 'csv-stringify/sync';
import { describe, it, expect, vi } from 'vitest';

vi.mock('csv-stringify/sync', () => ({
  stringify: vi.fn(),
}));

describe('POST /api/csv-export', () => {
  it('should return CSV file for valid input', async () => {
    const mockItems = [
      { id: 1, name: 'Pikachu', description: 'Electric' },
      { id: '2', name: 'Charizard', description: 'Fire' },
    ];

    vi.mocked(stringify).mockReturnValue('mocked,csv,content');

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: mockItems }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/csv');
    expect(response.headers.get('Content-Disposition')).toContain(
      '2_items.csv'
    );
    expect(await response.text()).toBe('mocked,csv,content');
  });

  it('should return 400 for invalid input (not array)', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: 'not-an-array' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('expected array');
  });

  it('should validate item structure', async () => {
    const invalidItems = [
      { id: 1, name: 'Valid' },
      { id: {}, name: 'Invalid' },
    ];

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: invalidItems }),
    });

    const response = await POST(request);

    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to generate CSV');
    expect(data.details).toContain('id must be string or number');
  });

  it('should handle CSV generation errors', async () => {
    const mockItems = [{ id: 1, name: 'Pikachu' }];
    vi.mocked(stringify).mockImplementation(() => {
      throw new Error('CSV generation failed');
    });

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: mockItems }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to generate CSV');
    expect(data.details).toBe('CSV generation failed');
  });
});

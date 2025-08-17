import { NextResponse } from 'next/server';
import { stringify } from 'csv-stringify/sync';

export const dynamic = 'force-dynamic';

interface PokemonCsvItem {
  id: string;
  name: string;
  description: string;
}

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid items data: expected array' },
        { status: 400 }
      );
    }

    const validatedItems = items.map(
      (item: { id: unknown; name: unknown; description?: unknown }) => {
        if (typeof item.id !== 'string' && typeof item.id !== 'number') {
          throw new Error(
            'Invalid item structure: id must be string or number'
          );
        }
        if (typeof item.name !== 'string') {
          throw new Error('Invalid item structure: name must be string');
        }

        return {
          id: item.id.toString(),
          name: item.name,
          description:
            typeof item.description === 'string' ? item.description : '',
        } satisfies PokemonCsvItem;
      }
    );

    const csvContent = stringify(validatedItems, {
      header: true,
      columns: [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'description', header: 'Description' },
      ],
      quoted: true,
      delimiter: ',',
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${items.length}_items.csv`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: unknown) {
    console.error('CSV generation error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to generate CSV',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

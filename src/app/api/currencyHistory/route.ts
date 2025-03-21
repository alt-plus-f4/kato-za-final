import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const days = parseInt(searchParams.get('days') || '30', 10);

  if (!from || !to || isNaN(days)) {
    console.error('Missing or invalid parameters:', { from, to, days });
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey) {
      console.error('Missing POLYGON_API_KEY');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const formattedStartDate = startDate.toISOString().split('T')[0];

    const url = `https://api.polygon.io/v2/aggs/ticker/C:${from}${to}/range/1/day/${formattedStartDate}/${endDate}?apiKey=${apiKey}`;
    console.log('Fetching data from:', url);

    const response = await fetch(url);
    const data = await response.json();

    console.log('Polygon API Response:', data);

    if (data.status !== 'OK' && data.status !== 'DELAYED') {
        throw new Error(data.error || 'Failed to fetch data');
    }

    return NextResponse.json(data.results);
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from')?.toUpperCase();
  const to = searchParams.get('to')?.toUpperCase();
  const amount = searchParams.get('amount');

  if (!from || !to || !amount) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const apiKey = process.env.FIXER_API_KEY;
    const url = `http://data.fixer.io/api/latest?access_key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.info || 'Failed to fetch conversion data');
    }

    const fromRate = data.rates[from];
    const toRate = data.rates[to];

    if (!fromRate || !toRate) {
      throw new Error(`Exchange rate for ${from} or ${to} not found`);
    }

    const convertedAmount = (parseFloat(amount) / fromRate) * toRate;

    return NextResponse.json({
      from,
      to,
      amount: parseFloat(amount),
      convertedAmount,
      rate: toRate / fromRate,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

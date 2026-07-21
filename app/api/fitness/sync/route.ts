import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { syncFitnessData, getFitnessMetrics } from '@/lib/fitness-data';

export const POST = withAuth(async (request, { userId }) => {
  const { date } = await request.json();
  const targetDate = date || new Date().toISOString().split('T')[0];

  const result = await syncFitnessData(userId, targetDate);
  return NextResponse.json(result);
});

export const GET = withAuth(async (request, { userId }) => {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

  const metrics = await getFitnessMetrics(userId, date);
  return NextResponse.json({ metrics });
});
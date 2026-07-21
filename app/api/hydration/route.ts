import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { getHydrationForDate, updateHydration, getHydrationStreak } from '@/lib/hydration';

export const GET = withAuth(async (request, { userId }) => {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

  const hydrationData = await getHydrationForDate(userId, date);
  const streak = await getHydrationStreak(userId);

  return NextResponse.json({
    hydration: hydrationData || { amount: 0, goal: 2500, entries: [] },
    streak
  });
});

export const POST = withAuth(async (request, { userId }) => {
  const { amount, date } = await request.json();
  const targetDate = date || new Date().toISOString().split('T')[0];

  const hydrationData = await updateHydration(userId, targetDate, amount);

  return NextResponse.json({ hydration: hydrationData });
});
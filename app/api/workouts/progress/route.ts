import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { getWorkoutProgress, getWorkoutStreak, getWeeklyProgress } from '@/lib/workouts';

export const dynamic = 'force-dynamic';

export const GET = withAuth(async (request, { userId }) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');

  if (type === 'streak') {
    const streak = await getWorkoutStreak(userId);
    return NextResponse.json({ streak });
  }

  if (type === 'weekly') {
    const weeklyProgress = await getWeeklyProgress(userId);
    return NextResponse.json({ progress: weeklyProgress });
  }

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'Start date and end date are required for progress data' },
      { status: 400 }
    );
  }

  const progress = await getWorkoutProgress(userId, startDate, endDate);
  return NextResponse.json({ progress });
});
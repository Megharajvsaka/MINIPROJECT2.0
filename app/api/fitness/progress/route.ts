import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { getWeeklyProgress, getProgressTrends, getUserAchievements } from '@/lib/fitness-data';

export const GET = withAuth(async (request, { userId }) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  switch (type) {
    case 'weekly': {
      const weeklyProgress = await getWeeklyProgress(userId);
      return NextResponse.json({ progress: weeklyProgress });
    }
    case 'trends': {
      const trends = await getProgressTrends(userId);
      return NextResponse.json({ trends });
    }
    case 'achievements': {
      const achievements = await getUserAchievements(userId);
      return NextResponse.json({ achievements });
    }
    default:
      return NextResponse.json(
        { error: 'Invalid progress type' },
        { status: 400 }
      );
  }
});
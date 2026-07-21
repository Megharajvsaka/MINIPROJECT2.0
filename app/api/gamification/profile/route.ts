import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { 
  getGamificationProfile, 
  getStreaks, 
  getRecentBadges, 
  getNextBadgeProgress,
  getActivityLogs 
} from '@/lib/gamification';

export const GET = withAuth(async (_, { userId }) => {
  const profile = await getGamificationProfile(userId);
  const streaks = await getStreaks(userId);
  const recentBadges = await getRecentBadges(userId);
  const nextBadge = await getNextBadgeProgress(userId);
  const activityLogs = await getActivityLogs(userId, 5);

  return NextResponse.json({
    profile,
    streaks,
    recentBadges,
    nextBadge,
    activityLogs
  });
});
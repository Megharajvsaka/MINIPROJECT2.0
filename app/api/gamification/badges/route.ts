import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { getUserBadges, markBadgesAsSeen } from '@/lib/gamification';

export const GET = withAuth(async (_, { userId }) => {
  const badges = await getUserBadges(userId);
  return NextResponse.json({ badges });
});

export const PUT = withAuth(async (request, { userId }) => {
  const { badgeIds } = await request.json();

  if (!badgeIds || !Array.isArray(badgeIds)) {
    return NextResponse.json(
      { error: 'Badge IDs array is required' },
      { status: 400 }
    );
  }

  await markBadgesAsSeen(userId, badgeIds);
  return NextResponse.json({ success: true });
});
import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { updateUserProfile } from '@/lib/auth';

export const PUT = withAuth(async (request, { userId }) => {
  const updates = await request.json();
  const user = await updateUserProfile(userId, updates);

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
});
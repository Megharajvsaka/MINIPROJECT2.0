import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { findUserById } from '@/lib/auth';

export const GET = withAuth(async (_, { userId }) => {
  const user = await findUserById(userId);
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
});
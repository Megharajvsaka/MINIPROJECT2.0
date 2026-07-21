import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { getFitnessGoals, updateFitnessGoals } from '@/lib/fitness-data';

export const GET = withAuth(async (_, { userId }) => {
  const goals = await getFitnessGoals(userId);
  return NextResponse.json({ goals });
});

export const PUT = withAuth(async (request, { userId }) => {
  const updates = await request.json();
  const goals = await updateFitnessGoals(userId, updates);
  return NextResponse.json({ goals });
});
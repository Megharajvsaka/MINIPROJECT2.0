import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { generateWorkoutPlan, getWorkoutPlansForUser } from '@/lib/workouts';

export const dynamic = 'force-dynamic';

export const GET = withAuth(async (_, { userId }) => {
  const plans = await getWorkoutPlansForUser(userId);
  return NextResponse.json({ plans });
});

export const POST = withAuth(async (request, { userId }) => {
  const { goal, startDate, weeks = 4 } = await request.json();

  if (!goal || !startDate) {
    return NextResponse.json(
      { error: 'Goal and start date are required' },
      { status: 400 }
    );
  }

  const validGoals = ['weight_loss', 'muscle_gain', 'flexibility', 'endurance', 'general_fitness'];
  if (!validGoals.includes(goal)) {
    return NextResponse.json(
      { error: 'Invalid goal specified' },
      { status: 400 }
    );
  }

  const plan = await generateWorkoutPlan(userId, goal, startDate, weeks);
  return NextResponse.json({ plan });
});
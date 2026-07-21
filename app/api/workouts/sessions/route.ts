import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { getWorkoutSessions, getTodaysWorkout, markExerciseCompleted, markExerciseUncompleted } from '@/lib/workouts';

export const dynamic = 'force-dynamic';

export const GET = withAuth(async (request, { userId }) => {
  const url = new URL(request.url);
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  const today = url.searchParams.get('today');

  if (today === 'true') {
    const todaysWorkout = await getTodaysWorkout(userId);
    return NextResponse.json({ session: todaysWorkout });
  }

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'Start date and end date are required' },
      { status: 400 }
    );
  }

  const sessions = await getWorkoutSessions(userId, startDate, endDate);
  return NextResponse.json({ sessions });
});

export const PUT = withAuth(async (request, { userId }) => {
  const { sessionId, exerciseId, completed } = await request.json();

  if (!sessionId || !exerciseId || completed === undefined) {
    return NextResponse.json(
      { error: 'Session ID, exercise ID, and completed status are required' },
      { status: 400 }
    );
  }

  let session;
  if (completed) {
    session = await markExerciseCompleted(userId, sessionId, exerciseId);
  } else {
    session = await markExerciseUncompleted(userId, sessionId, exerciseId);
  }

  if (!session) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ session });
});
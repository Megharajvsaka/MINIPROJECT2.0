import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { getWorkoutMotivation } from '@/lib/ai-assistant';

export const POST = withAuth(async (request) => {
  const { status } = await request.json();

  if (!status || !['missed', 'completed'].includes(status)) {
    return NextResponse.json(
      { error: 'Valid status (missed or completed) is required' },
      { status: 400 }
    );
  }

  const motivationMessage = await getWorkoutMotivation(status);

  return NextResponse.json({
    message: motivationMessage,
    success: true
  });
});
import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { getWorkoutSuggestion } from '@/lib/ai-assistant';

export const POST = withAuth(async (request) => {
  const body = await request.json();
  const preferences = body.preferences ?? {};

  const suggestionMessage = await getWorkoutSuggestion(preferences);

  return NextResponse.json({
    message: suggestionMessage,
    success: true
  });
});
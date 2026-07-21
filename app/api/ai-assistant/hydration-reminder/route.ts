import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { getHydrationReminder } from '@/lib/ai-assistant';

export const GET = withAuth(async () => {
  const reminderMessage = await getHydrationReminder();

  return NextResponse.json({
    message: reminderMessage,
    success: true
  });
});
import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { getAssistantResponse, addUserMessage, getConversationHistory } from '@/lib/ai-assistant';

export const GET = withAuth(async (request, { userId }) => {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '20');

  const history = await getConversationHistory(userId, limit);

  return NextResponse.json({ history, success: true });
});

export const POST = withAuth(async (request, { userId }) => {
  const { message } = await request.json();

  if (!message || typeof message !== 'string') {
    return NextResponse.json(
      { error: 'Message is required' },
      { status: 400 }
    );
  }

  // Add user message to conversation history (with userId for DB save)
  const userMessage = addUserMessage(message, userId);

  // Get AI response (this saves both messages to MongoDB)
  const assistantResponse = await getAssistantResponse(message, userId);

  return NextResponse.json({
    userMessage,
    assistantResponse,
    success: true
  });
});
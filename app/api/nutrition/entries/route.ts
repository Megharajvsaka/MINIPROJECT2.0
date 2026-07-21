import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { addFoodEntry, getFoodEntriesForDate, getDailyTotals, deleteFoodEntry } from '@/lib/nutrition';

export const GET = withAuth(async (request, { userId }) => {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

  const entries = await getFoodEntriesForDate(userId, date);
  const dailyTotals = await getDailyTotals(userId, date);

  return NextResponse.json({ entries, dailyTotals });
});

export const POST = withAuth(async (request, { userId }) => {
  const { 
    date, 
    name, 
    calories, 
    protein, 
    carbs, 
    fat, 
    quantity = 1, 
    unit = 'serving', 
    mealType = 'lunch' 
  } = await request.json();

  if (!name || !calories || protein === undefined || carbs === undefined || fat === undefined) {
    return NextResponse.json(
      { error: 'Food name and all nutrition values are required' },
      { status: 400 }
    );
  }

  const targetDate = date || new Date().toISOString().split('T')[0];

  const entry = await addFoodEntry(
    userId,
    targetDate,
    name,
    calories,
    protein,
    carbs,
    fat,
    quantity,
    unit,
    mealType
  );

  return NextResponse.json({ entry });
});

export const DELETE = withAuth(async (request, { userId }) => {
  const url = new URL(request.url);
  const entryId = url.searchParams.get('id');

  if (!entryId) {
    return NextResponse.json(
      { error: 'Entry ID is required' },
      { status: 400 }
    );
  }

  const success = await deleteFoodEntry(userId, entryId);

  if (!success) {
    return NextResponse.json(
      { error: 'Entry not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
});
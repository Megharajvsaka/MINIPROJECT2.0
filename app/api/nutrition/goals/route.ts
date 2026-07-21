import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { getNutritionGoal, setNutritionGoal } from '@/lib/nutrition';

export const GET = withAuth(async (_, { userId }) => {
  const goal = await getNutritionGoal(userId);
  return NextResponse.json({ goal });
});

export const POST = withAuth(async (request, { userId }) => {
  const { calories, protein, carbs, fat } = await request.json();

  if (!calories || !protein || !carbs || !fat) {
    return NextResponse.json(
      { error: 'All nutrition values are required' },
      { status: 400 }
    );
  }

  const goal = await setNutritionGoal(userId, calories, protein, carbs, fat);
  return NextResponse.json({ goal });
});
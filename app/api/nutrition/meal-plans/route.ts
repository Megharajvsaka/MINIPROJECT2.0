import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middleware';
import { generateMealPlan, getMealPlansForUser } from '@/lib/nutrition';
import { findUserById } from '@/lib/auth';

export const GET = withAuth(async (_, { userId }) => {
  const mealPlans = await getMealPlansForUser(userId);
  return NextResponse.json({ mealPlans });
});

export const POST = withAuth(async (request, { userId }) => {
  const { startDate, endDate } = await request.json();

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'Start date and end date are required' },
      { status: 400 }
    );
  }

  const user = await findUserById(userId);
  if (!user || !user.fitnessGoal) {
    return NextResponse.json(
      { error: 'User fitness goal must be set before generating meal plan' },
      { status: 400 }
    );
  }

  const mealPlan = await generateMealPlan(
    userId,
    startDate,
    endDate,
    user.fitnessGoal
  );

  return NextResponse.json({ mealPlan });
});
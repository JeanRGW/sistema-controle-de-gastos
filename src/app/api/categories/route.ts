import routeErrorHandler from '@/lib/errors/routeErrorHandler';
import withAuth from '@/lib/withAuth';
import { createCategory, getUserCategories } from '@/services/categoryServices';
import { NewCategorySchema } from '@/validations/category';
import { NextResponse } from 'next/server';

export const GET = withAuth(async (_req, _ctx, userId) => {
  try {
    const categories = await getUserCategories(userId);

    return NextResponse.json(categories);
  } catch (error) {
    return routeErrorHandler(error);
  }
});

export const POST = withAuth(async (req, _, userId) => {
  try {
    const data = await req.json();
    const validated = NewCategorySchema.parse(data);

    const category = await createCategory(userId, validated);
    return NextResponse.json(category);
  } catch (error) {
    return routeErrorHandler(error);
  }
});

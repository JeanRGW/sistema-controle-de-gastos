import AppError from '@/lib/errors/AppError';
import routeErrorHandler from '@/lib/errors/routeErrorHandler';
import withAuth from '@/lib/withAuth';
import {
  deleteCategoryById,
  getCategoryById,
  updateCategoryById,
} from '@/services/categoryServices';
import { UpdatableCategorySchema } from '@/validations/category';
import { NextResponse } from 'next/server';

export const GET = withAuth(async (_req, context, userId) => {
  try {
    const { id } = await context.params;

    const category = await getCategoryById(parseInt(id), userId);
    if (!category) throw new AppError('Category not found', 404);

    return NextResponse.json(category);
  } catch (error) {
    return routeErrorHandler(error);
  }
});

export const PUT = withAuth(async (req, context, userId) => {
  try {
    const { id } = await context.params;

    const data = await req.json();
    const validated = UpdatableCategorySchema.parse(data);

    const category = await updateCategoryById(parseInt(id), userId, validated);

    return NextResponse.json(category);
  } catch (error) {
    return routeErrorHandler(error);
  }
});

export const DELETE = withAuth(async (_req, context, userId) => {
  try {
    const { id } = await context.params;

    await deleteCategoryById(parseInt(id), userId);

    return NextResponse.json('Category deleted with success.');
  } catch (error) {
    return routeErrorHandler(error);
  }
});

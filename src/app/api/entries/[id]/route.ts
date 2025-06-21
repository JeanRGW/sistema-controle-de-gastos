import AppError from '@/lib/errors/AppError';
import routeErrorHandler from '@/lib/errors/routeErrorHandler';
import withAuth from '@/lib/withAuth';
import {
  deleteEntryById,
  getEntryById,
  updateEntryById,
} from '@/services/entryServices';
import { UpdatableEntrySchema } from '@/validations/entry';
import { NextResponse } from 'next/server';

export const GET = withAuth(async (_req, context, userId) => {
  try {
    const { id } = await context.params;

    const entry = await getEntryById(parseInt(id), userId);
    if (!entry) throw new AppError('Entry not found', 404);

    return NextResponse.json(entry);
  } catch (error) {
    return routeErrorHandler(error);
  }
});

export const PUT = withAuth(async (req, context, userId) => {
  try {
    const { id } = await context.params;

    const data = await req.json();
    const validated = UpdatableEntrySchema.parse(data);

    const entry = await updateEntryById(parseInt(id), userId, validated);

    return NextResponse.json(entry);
  } catch (error) {
    return routeErrorHandler(error);
  }
});

export const DELETE = withAuth(async (_req, context, userId) => {
  try {
    const { id } = await context.params;

    await deleteEntryById(parseInt(id), userId);

    return NextResponse.json('Entry deleted with success.');
  } catch (error) {
    return routeErrorHandler(error);
  }
});

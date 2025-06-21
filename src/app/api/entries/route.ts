import routeErrorHandler from '@/lib/errors/routeErrorHandler';
import withAuth from '@/lib/withAuth';
import { createEntry, getUserEntries } from '@/services/entryServices';
import { NewEntrySchema } from '@/validations/entry';
import { NextResponse } from 'next/server';

export const GET = withAuth(async (_req, _ctx, userId) => {
  try {
    const entries = await getUserEntries(userId);

    return NextResponse.json(entries);
  } catch (error) {
    return routeErrorHandler(error);
  }
});

export const POST = withAuth(async (req, _ctx, userId) => {
  try {
    const data = await req.json();
    const validated = NewEntrySchema.parse(data);

    const entry = await createEntry(validated, userId);

    return NextResponse.json(entry);
  } catch (error) {
    return routeErrorHandler(error);
  }
});

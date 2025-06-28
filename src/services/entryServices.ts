import db from '@/db';
import { IEntry, entriesTable } from '@/db/schema';
import AppError from '@/lib/errors/AppError';
import { and, eq } from 'drizzle-orm';
import {
  ValidatedNewEntry,
  ValidatedUpdatableEntry,
} from '@/validations/entry';
import { getCategoryById } from './categoryServices';

export async function getEntryById(
  id: number,
  userId: number
): Promise<IEntry | null> {
  const entry = await db.query.entriesTable.findFirst({
    where: (entries, { eq, and }) =>
      and(eq(entries.id, id), eq(entries.userId, userId)),
  });

  return entry || null;
}

export async function getUserEntries(userId: number): Promise<IEntry[]> {
  const entries = await db.query.entriesTable.findMany({
    where: (entries, { eq }) => eq(entries.userId, userId),
  });

  return entries;
}

export async function createEntry(
  data: ValidatedNewEntry,
  userId: number
): Promise<IEntry> {
  const category = await getCategoryById(data.categoryId, userId);
  if (!category) throw new AppError('Invalid categoryId on request.', 400);

  const [entry] = await db
    .insert(entriesTable)
    .values({ ...data, userId })
    .returning();

  return entry;
}

export async function updateEntryById(
  id: number,
  userId: number,
  data: ValidatedUpdatableEntry
): Promise<IEntry> {
  if (data.categoryId !== undefined) {
    const category = await getCategoryById(data.categoryId, userId);
    if (!category) throw new AppError('Invalid categoryId on request.', 400);
  }

  const [entry] = await db
    .update(entriesTable)
    .set(data)
    .where(and(eq(entriesTable.id, id), eq(entriesTable.userId, userId)))
    .returning();

  if (!entry) {
    throw new AppError('Entry not found or does not belong to user.', 404);
  }

  return entry;
}

export async function deleteEntryById(id: number, userId: number) {
  const [entry] = await db
    .delete(entriesTable)
    .where(and(eq(entriesTable.id, id), eq(entriesTable.userId, userId)))
    .returning();

  if (!entry)
    throw new AppError('Category not found or does not belong to user.', 404);
}

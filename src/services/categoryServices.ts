import db from '@/db';
import { ICategory, categoriesTable } from '@/db/schema';
import AppError from '@/lib/errors/AppError';
import {
  ValidatedNewCategory,
  ValidatedUpdatableCategory,
} from '@/validations/category';
import { and, eq } from 'drizzle-orm';

export async function getCategoryById(
  id: number,
  userId: number
): Promise<ICategory | null> {
  const category = await db.query.categoriesTable.findFirst({
    where: (categories, { eq, and }) =>
      and(eq(categories.id, id), eq(categories.userId, userId)),
  });

  return category || null;
}

export async function getUserCategories(userId: number): Promise<ICategory[]> {
  const categories = await db.query.categoriesTable.findMany({
    where: (categories, { eq, or, isNull }) =>
      or(eq(categories.userId, userId), isNull(categories.userId)),
  });

  return categories;
}

export async function createCategory(
  userId: number,
  data: ValidatedNewCategory
): Promise<ICategory> {
  const [category] = await db
    .insert(categoriesTable)
    .values({ ...data, userId })
    .returning();

  if (!category)
    throw new AppError('The user already has an cateogry with this name.', 409);

  return category;
}

export async function updateCategoryById(
  id: number,
  userId: number,
  data: ValidatedUpdatableCategory
): Promise<ICategory> {
  const [category] = await db
    .update(categoriesTable)
    .set(data)
    .where(and(eq(categoriesTable.id, id), eq(categoriesTable.userId, userId)))
    .returning();

  if (!category) {
    throw new AppError('Category not found or does not belong to user.', 404);
  }

  return category;
}

export async function deleteCategoryById(id: number, userId: number) {
  const [category] = await db
    .delete(categoriesTable)
    .where(and(eq(categoriesTable.id, id), eq(categoriesTable.userId, userId)))
    .returning();

  if (!category)
    throw new AppError('Category not found or does not belong to user.', 404);
}

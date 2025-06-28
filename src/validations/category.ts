import { z } from 'zod';

export const NewCategorySchema = z.object({
  name: z.string().max(255),
});
export type ValidatedNewCategory = z.infer<typeof NewCategorySchema>;

export const UpdatableCategorySchema = z.object({
  name: z.string().max(255),
});
export type ValidatedUpdatableCategory = z.infer<
  typeof UpdatableCategorySchema
>;

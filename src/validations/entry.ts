import { z } from 'zod';

const dateFromString = z.preprocess(
  (val) =>
    typeof val === 'string' || val instanceof Date ? new Date(val) : undefined,
  z.date()
);

export const NewEntrySchema = z.object({
  value: z
    .string({
      invalid_type_error: 'Value must be an string representing an number.',
    })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: 'Value must be a valid number with up to two decimal places',
    }),
  categoryId: z.coerce.number().int(),
  date: dateFromString,
  name: z.string().max(255),
  isRecurring: z.coerce.boolean().optional(),
  recurringEndDate: dateFromString.optional(),
});
export type ValidatedNewEntry = z.infer<typeof NewEntrySchema>;

export const UpdatableEntrySchema = NewEntrySchema.partial();
export type ValidatedUpdatableEntry = z.infer<typeof UpdatableEntrySchema>;

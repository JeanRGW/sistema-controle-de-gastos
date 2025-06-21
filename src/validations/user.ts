import { z } from 'zod';

export const NewUserSchema = z.object({
  name: z.string().max(255),
  email: z
    .string()
    .email()
    .max(255)
    .transform((val) => val.toLowerCase()),
  password: z.string().min(8).max(255),
});
export type ValidatedNewUser = z.infer<typeof NewUserSchema>;

export const UpdatableUserSchema = NewUserSchema.partial();
export type ValidatedUpdatableUser = z.infer<typeof UpdatableUserSchema>;

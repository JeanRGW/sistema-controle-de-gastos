import db, { PostgresErrorCode } from '@/db';
import { IUser, usersTable } from '@/db/schema';
import { DatabaseError } from 'pg';
import AppError from '@/lib/errors/AppError';
import { ValidatedNewUser, ValidatedUpdatableUser } from '@/validations/user';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';

export async function getUser(id: number): Promise<IUser> {
  const user = await db.query.usersTable.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });

  if (!user) throw new AppError('User not found', 404);

  return user;
}

export async function createUser(data: ValidatedNewUser): Promise<IUser> {
  data.password = await hash(data.password, 5);

  const [user] = await db
    .insert(usersTable)
    .values(data)
    .returning()
    .onConflictDoNothing({ target: usersTable.email });

  if (!user) throw new AppError('A user with that email already exists.', 409);

  return user;
}

export async function updateUser(
  id: number,
  data: ValidatedUpdatableUser
): Promise<IUser> {
  try {
    if (data.password !== undefined)
      data.password = await hash(data.password, 5);

    const [user] = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) throw new AppError('User not found.', 404);

    return user;
  } catch (err) {
    if (
      err instanceof DatabaseError &&
      err.code === PostgresErrorCode.UniqueViolation
    )
      throw new AppError('A user with that email already exists.', 409);
    else throw err;
  }
}

export async function deleteUser(id: number) {
  const [user] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning();

  if (!user) throw new AppError('User not found', 404);
}

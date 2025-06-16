import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import AppError from '@/lib/errors/AppError';
import { usersTable } from '@/lib/db/schema';
import routeErrorHandler from '@/lib/errors/routeErrorHandler';

const createUserSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email(),
});

export const POST = async (req: NextRequest): Promise<Response> => {
  try {
    const body = await req.json();
    const { name, email, password } = createUserSchema.parse(body);

    const existingUser = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
    if (existingUser) {
      throw new AppError('Email is already in use.', 407);
    }

    const user = (
      await db.insert(usersTable).values({ name, email, password }).returning()
    )[0];

    return new Response(JSON.stringify(user));
  } catch (e) {
    console.log(e);

    return routeErrorHandler(e);
  }
};

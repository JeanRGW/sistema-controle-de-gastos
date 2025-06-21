import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import AppError from '@/lib/errors/AppError';
import routeErrorHandler from '@/lib/errors/routeErrorHandler';
import db from '@/lib/db';

const createSessionModel = z.object({
  password: z.string().min(1),
  email: z.string().email(),
});

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = createSessionModel.parse(req.body);

    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user || user.password !== password)
      throw new AppError('Invalid user/email combination.', 400);

    return new NextResponse();
  } catch (e) {
    console.error(e);

    return routeErrorHandler(e);
  }
};

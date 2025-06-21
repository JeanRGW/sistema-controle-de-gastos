import routeErrorHandler from '@/lib/errors/routeErrorHandler';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import db from '@/db';
import AppError from '@/lib/errors/AppError';

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const validated = AuthSchema.parse(data);

    const user = await db.query.usersTable.findFirst({
      where: (usersTable, { eq }) => eq(usersTable.email, validated.email),
    });

    if (!user) throw new AppError('Invalid password/email combination.', 400);

    const passwordMatch = await compare(validated.password, user.password);
    if (!passwordMatch)
      throw new AppError('Invalid password/email combination.', 400);

    const token = jwt.sign({}, process.env.JWT_SECRET!, {
      subject: user.id.toString(),
      expiresIn: '12h',
    });

    return NextResponse.json(token);
  } catch (error) {
    return routeErrorHandler(error);
  }
};

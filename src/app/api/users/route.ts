import routeErrorHandler from '@/lib/errors/routeErrorHandler';
import withAuth from '@/lib/withAuth';
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from '@/services/userServices';
import { NewUserSchema, UpdatableUserSchema } from '@/validations/user';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth(async (_req, _ctx, userId) => {
  try {
    const usr = await getUser(userId);

    return NextResponse.json(usr);
  } catch (error) {
    return routeErrorHandler(error);
  }
});

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const validated = NewUserSchema.parse(data);

    const user = await createUser(validated);

    return NextResponse.json(user);
  } catch (error) {
    return routeErrorHandler(error);
  }
};

export const PUT = withAuth(async (req, _ctx, userId) => {
  try {
    const data = await req.json();
    const validated = UpdatableUserSchema.parse(data);

    const usr = await updateUser(userId, validated);

    return NextResponse.json(usr);
  } catch (error) {
    return routeErrorHandler(error);
  }
});

export const DELETE = withAuth(async (_req, _ctx, userId) => {
  try {
    await deleteUser(userId);

    return NextResponse.json('User deleted with success');
  } catch (error) {
    return routeErrorHandler(error);
  }
});

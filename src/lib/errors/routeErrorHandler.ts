import { ZodError } from 'zod';
import AppError from './AppError';
import { NextResponse } from 'next/server';

export default async function routeErrorHandler(
  e: unknown
): Promise<NextResponse> {
  if (e instanceof ZodError) {
    return NextResponse.json(e.issues, {
      status: 400,
    });
  }

  if (e instanceof AppError) {
    return NextResponse.json(e.message, {
      status: e.code,
    });
  }

  console.error(e);
  return NextResponse.json('Internal server error.', {
    status: 500,
  });
}

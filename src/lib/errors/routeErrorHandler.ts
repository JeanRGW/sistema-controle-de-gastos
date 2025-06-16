import { ZodError } from 'zod';
import AppError from './AppError';

export default async function routeErrorHandler(e: unknown): Promise<Response> {
  if (e instanceof ZodError) {
    return new Response(JSON.stringify(e.issues), {
      status: 400,
    });
  }

  if (e instanceof AppError) {
    return new Response(JSON.stringify(e.msg), {
      status: e.status,
    });
  }

  console.error(e);
  return new Response('Internal server error.', {
    status: 500,
  });
}

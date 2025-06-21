import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
const withAuth = (
  handler: (
    req: NextRequest,
    context: { params: { [key: string]: string } },
    userId: number
  ) => Promise<NextResponse>
) => {
  return async (
    req: NextRequest,
    context: { params: { [key: string]: string } }
  ) => {
    const auth = req.headers.get('authorization');
    if (!auth) {
      return NextResponse.json({ error: 'Missing token.' }, { status: 401 });
    }

    const token = auth.split(' ')[1];
    let userId: number;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      userId = parseInt(decoded.sub);
    } catch {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    return handler(req, context, userId);
  };
};

export default withAuth;

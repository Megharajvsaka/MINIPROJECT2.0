import { NextResponse } from 'next/server';
import { verifyToken } from './auth';

/**
 * Authenticated Request Context
 * Passed to every route handler that uses withAuth().
 */
export interface AuthContext {
  userId: string;
}

/**
 * Route handler type for authenticated routes.
 * Receives the original Request plus the verified AuthContext.
 */
type AuthenticatedHandler = (
  request: Request,
  context: AuthContext
) => Promise<NextResponse>;

/**
 * withAuth — Higher-Order Function (Decorator Pattern)
 *
 * Pattern: Middleware / Decorator
 *
 * Wraps any route handler with JWT authentication.
 * Instead of copy-pasting 10 lines of auth logic into every route,
 * you wrap the handler once and get authentication for free.
 *
 * Before (copy-pasted in every route):
 *   const authHeader = request.headers.get('authorization');
 *   const token = authHeader?.replace('Bearer ', '');
 *   if (!token) return NextResponse.json({ error: ... }, { status: 401 });
 *   const decoded = verifyToken(token);
 *   if (!decoded) return NextResponse.json({ error: ... }, { status: 401 });
 *
 * After (with withAuth):
 *   export const GET = withAuth(async (request, { userId }) => { ... });
 *
 * This is exactly how Express middleware works, and how Next.js Middleware works.
 * Netflix, Google, Amazon all use this pattern for API gateway authentication.
 *
 * Benefits:
 * - Single place to update auth logic (e.g., add token blacklisting)
 * - Impossible to accidentally forget auth on a protected route
 * - Routes focus on business logic, not auth plumbing
 * - Consistent error responses across all endpoints
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async function (request: Request): Promise<NextResponse> {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    try {
      return await handler(request, { userId: decoded.userId });
    } catch (error: unknown) {
      console.error('[API Error]', request.method, request.url, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

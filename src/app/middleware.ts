import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/analyze')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

// This tells Next.js to run the middleware for specific routes
export const config = {
  matcher: ['/analyze'],
};

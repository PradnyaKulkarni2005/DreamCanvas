import { NextResponse } from 'next/server';
// createRouteHandlerClient is used to create a Supabase client for route handlers
// This is necessary for server-side operations in Next.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// cookies is used to access cookies in the Next.js request context
// This is necessary to manage authentication state with Supabase
import { cookies } from 'next/headers';

/**
 * This route handles user login using Supabase authentication.
 * It expects a POST request with JSON body containing email and password.
 * On success, it returns the user data; on failure, it returns an error message.
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json(); // Parse incoming request body

    // Validate request input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // ✅ Get the cookie store for managing Supabase auth session
    const cookieStore = cookies();

    // ✅ Fix: createRouteHandlerClient expects a function that returns the cookies instance
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Sign in the user using Supabase auth with email and password
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // Handle authentication failure
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // ✅ Ensure session cookies are set correctly by fetching session
const { error: sessionError } = await supabase.auth.getSession();

if (sessionError) {
  console.error('🔴 Session error:', sessionError);
  return NextResponse.json({ error: 'Session error while logging in' }, { status: 500 });
}


    // ✅ Optionally, you can create a custom response object
    // for setting cookies or redirecting after successful login
    const response = NextResponse.json({ success: true, user: data.user });

    return response;
  } catch (err: unknown) {
    // Log the error for debugging
    console.error('Login route error:', err);

    // Return a generic internal server error response
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

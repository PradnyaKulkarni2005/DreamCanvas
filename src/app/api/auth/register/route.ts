// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/app/libs/supabaseClient';

export async function POST(req: Request) {
  try {
    const { email, password, full_name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name, // Store full name in user metadata
        },
      },
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    const user = signUpData.user;

    if (user) {
      // Insert into custom 'users' table
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email,
            full_name,
          },
        ]);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, user: signUpData.user });

  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

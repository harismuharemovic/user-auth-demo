import { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import bcrypt from 'bcrypt';
import { sessionOptions } from '@/lib/session';

interface LoginRequestBody {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  password_hash: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON request body
    const body: LoginRequestBody = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return Response.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Query the database for the user
    const getUserQuery = 'SELECT * FROM users WHERE email = ?';

    const user = await new Promise<User | null>((resolve, reject) => {
      db.get(getUserQuery, [email], (err, row: User | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });

    // Check if user exists
    if (!user) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Create session using iron-session
    const cookieStore = await cookies();
    const session = await getIronSession<{
      user?: { id: number; email: string };
    }>(cookieStore, sessionOptions);

    // Set user data in session
    session.user = {
      id: user.id,
      email: user.email,
    };

    // Save the session (this will set the HTTP-only cookie)
    await session.save();

    // Return success response
    return Response.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return Response.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Handle database errors
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

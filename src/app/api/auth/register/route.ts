import { NextRequest } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcrypt';

interface RegisterRequestBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON request body
    const body: RegisterRequestBody = await request.json();
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

    // Validate password length (minimum 6 characters)
    if (password.length < 6) {
      return Response.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database (wrapped in Promise for async/await)
    const result = await new Promise<{ success: boolean; error?: string }>(
      resolve => {
        const query =
          'INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)';
        db.run(query, [email, hashedPassword], function (err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              resolve({ success: false, error: 'Email already in use' });
            } else {
              console.error('Database error:', err);
              resolve({ success: false, error: 'Internal Server Error' });
            }
          } else {
            resolve({ success: true });
          }
        });
      }
    );

    // Handle database operation result
    if (!result.success) {
      if (result.error === 'Email already in use') {
        return Response.json(
          { message: 'Email already in use' },
          { status: 409 }
        );
      } else {
        return Response.json(
          { message: 'Internal Server Error' },
          { status: 500 }
        );
      }
    }

    // Success response
    return Response.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return Response.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Handle other errors
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

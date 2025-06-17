import { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    // Get the iron session using cookies
    const cookieStore = await cookies();
    const session = await getIronSession<{
      user?: { id: number; email: string };
    }>(cookieStore, sessionOptions);

    // Check if there's an active session
    if (!session.user) {
      return Response.json(
        { message: 'No active session found' },
        { status: 400 }
      );
    }

    // Destroy the session by clearing the user data
    session.user = undefined;

    // Save the session (this will clear the cookie)
    await session.save();

    // Return success response
    return Response.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);

    // Handle any errors during logout
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

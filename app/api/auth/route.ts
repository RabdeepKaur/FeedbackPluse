import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, provider, providerId, firebaseUid } = body;

    console.log('Auth request for:', email);

    let user;

    // Handle Firebase/OAuth authentication
    if (firebaseUid || (provider && providerId)) {
      const uid = firebaseUid || providerId;
      
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: uid },
            { email: email },
          ],
        },
      });

      if (!user) {
        // Create new user for OAuth/Firebase
        user = await prisma.user.create({
          data: {
            id: uid,
            email,
            name: name || null,
            provider: provider || 'email',
            providerId: uid,
            emailVerified: new Date(),
          },
        });
        console.log('Created new OAuth/Firebase user:', user.id);
      }
    } 
    // Handle email/password authentication
    else {
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Signup - create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
          },
        });
        console.log('Created new user:', user.id);
      } else {
        // Login - verify password
        if (!user.password) {
          console.log('User has no password set');
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          console.log('Invalid password');
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }
        console.log('Password verified for user:', user.id);
      }
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate session token
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

    console.log('Creating session for user:', user.id);
    console.log('Session token:', sessionToken);
    console.log('Expires at:', expiresAt);

    // Create session in database
    const session = await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
        expiresAt: expiresAt,
      },
    });

    console.log('Session created with ID:', session.id);

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    // Set session cookie - IMPORTANT: use 'session-token' to match auth.ts
    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    console.log('Cookie set, authentication successful');

    return response;
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', details: error.message },
      { status: 500 }
    );
  }
}
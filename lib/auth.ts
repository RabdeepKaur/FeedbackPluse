import { cookies } from 'next/headers';
import prisma from './prisma';

export const auth = {
  async getUserId(): Promise<string | null> {
    try {
      // Get session token from cookies
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get('session-token')?.value;

      if (!sessionToken) {
        return null;
      }

      // Find session and return userId
      const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        select: { userId: true, expiresAt: true },
      });

      if (!session || session.expiresAt < new Date()) {
        return null;
      }

      return session.userId;
    } catch (error) {
      console.error('Auth error:', error);
      return null;
    }
  },

  async getUser() {
    try {
      const userId = await this.getUserId();
      if (!userId) return null;

      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },
};
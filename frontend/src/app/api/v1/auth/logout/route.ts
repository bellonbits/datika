import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { ok, err } from '@/lib/db/auth';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }
    return ok(null, 'Logged out successfully');
  } catch (e) {
    console.error('[logout]', e);
    return err('Failed to logout', 500);
  }
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, ok, err } from '@/lib/db/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.sub },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, isActive: true },
    });
    if (!user || !user.isActive) return unauthorized();
    return ok(user);
  } catch (e) {
    console.error('[me]', e);
    return err('Failed to fetch user', 500);
  }
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, ok, err } from '@/lib/db/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: auth.sub },
      orderBy: { updatedAt: 'desc' },
      take: 30,
      select: { id: true, title: true, updatedAt: true, createdAt: true },
    });
    return ok(sessions);
  } catch (e) {
    console.error('[chat/sessions]', e);
    return err('Failed to fetch sessions', 500);
  }
}

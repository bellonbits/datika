import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, forbidden, ok, err } from '@/lib/db/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  try {
    const session = await prisma.chatSession.findUnique({
      where: { id: params.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!session) return err('Session not found', 404);
    if (session.userId !== auth.sub) return forbidden();
    return ok(session);
  } catch (e) {
    console.error('[chat/session]', e);
    return err('Failed to fetch session', 500);
  }
}

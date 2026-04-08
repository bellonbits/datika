import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, forbidden, ok, err } from '@/lib/db/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  if (auth.sub !== params.id && auth.role !== 'ADMIN') return forbidden();
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, avatarUrl: true },
    });
    if (!user) return err('User not found', 404);
    return ok(user);
  } catch (e) {
    return err('Failed to fetch user', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  if (auth.sub !== params.id && auth.role !== 'ADMIN') return forbidden();
  try {
    const body = await req.json();
    const allowed = ['name', 'avatarUrl', 'bio', 'phone', 'country'] as const;
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) data[key] = body[key];
    }
    const user = await prisma.user.update({
      where: { id: params.id },
      data,
      select: { id: true, name: true, email: true, role: true, avatarUrl: true },
    });
    return ok(user, 'Profile updated');
  } catch (e) {
    console.error('[user PATCH]', e);
    return err('Failed to update user', 500);
  }
}

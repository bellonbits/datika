import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, forbidden, ok, err } from '@/lib/db/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  if (auth.role !== 'ADMIN') return forbidden();

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, students, instructors, admins, newUsersToday] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
    ]);

    return ok({ total, students, instructors, admins, newUsersToday });
  } catch (e) {
    console.error('[users/stats GET]', e);
    return err('Failed to fetch user stats', 500);
  }
}

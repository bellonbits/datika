import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, ok, err } from '@/lib/db/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: auth.sub },
      include: {
        course: {
          include: {
            instructor: { select: { id: true, name: true, avatarUrl: true } },
            sections: { include: { lessons: { select: { id: true } } } },
          },
        },
        lessonProgress: { select: { completed: true } },
      },
      orderBy: { enrolledAt: 'desc' },
    });
    return ok(enrollments);
  } catch (e) {
    console.error('[enrollments/my]', e);
    return err('Failed to fetch enrollments', 500);
  }
}

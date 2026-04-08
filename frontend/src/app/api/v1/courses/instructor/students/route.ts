import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, forbidden, ok, err } from '@/lib/db/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  if (auth.role !== 'INSTRUCTOR' && auth.role !== 'ADMIN') return forbidden();

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { course: { instructorId: auth.sub } },
      orderBy: { enrolledAt: 'desc' },
      take: 50,
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        course: { select: { id: true, title: true } },
      },
    });

    const result = enrollments.map((e) => ({
      id: e.id,
      name: e.user.name,
      email: e.user.email,
      avatarUrl: e.user.avatarUrl,
      courseId: e.course.id,
      courseTitle: e.course.title,
      enrolledAt: e.enrolledAt,
      progress: e.progress,
    }));

    return ok(result);
  } catch (e) {
    console.error('[courses/instructor/students GET]', e);
    return err('Failed to fetch students', 500);
  }
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, forbidden, ok, err } from '@/lib/db/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  if (auth.role !== 'INSTRUCTOR' && auth.role !== 'ADMIN') return forbidden();

  try {
    const courses = await prisma.course.findMany({
      where: { instructorId: auth.sub },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { enrollments: true, sections: true } },
      },
    });

    return ok(courses);
  } catch (e) {
    console.error('[courses/my-courses GET]', e);
    return err('Failed to fetch courses', 500);
  }
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, ok, err } from '@/lib/db/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  try {
    const course = await prisma.course.findUnique({ where: { id: params.id } });
    if (!course) return err('Course not found', 404);

    const existing = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: auth.sub, courseId: params.id } },
    });
    if (existing) return ok({ enrollment: existing }, 'Already enrolled');

    if (course.price && Number(course.price) > 0) {
      return err('This course requires payment', 402);
    }

    const enrollment = await prisma.enrollment.create({
      data: { studentId: auth.sub, courseId: params.id, status: 'ACTIVE', progress: 0 },
    });
    return ok({ enrollment }, 'Enrolled successfully', 201);
  } catch (e) {
    console.error('[enroll]', e);
    return err('Enrollment failed', 500);
  }
}

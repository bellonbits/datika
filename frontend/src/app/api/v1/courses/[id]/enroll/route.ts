import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, ok, err } from '@/lib/db/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthUser(req);
  if (!auth) {
    console.warn('[enroll] Unauthorized access attempt: no auth token');
    return unauthorized();
  }
  
  console.log(`[enroll] User ${auth.sub} (${auth.role}) enrolling in course ${params.id}`);

  try {
    const course = await prisma.course.findUnique({ where: { id: params.id } });
    if (!course) {
      console.error(`[enroll] Course ${params.id} not found`);
      return err('Course not found', 404);
    }

    const existing = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: auth.sub, courseId: params.id } },
    });
    
    if (existing) {
      console.log(`[enroll] User ${auth.sub} already enrolled in ${params.id}`);
      return ok({ enrollment: existing }, 'Already enrolled');
    }

    if (course.price && Number(course.price) > 0) {
      console.warn(`[enroll] Course ${params.id} requires payment but user tried direct enrollment`);
      return err('This course requires payment', 402);
    }

    const enrollment = await prisma.enrollment.create({
      data: { studentId: auth.sub, courseId: params.id, status: 'ACTIVE', progress: 0 },
    });
    
    console.log(`[enroll] Successfully enrolled student ${auth.sub} in ${params.id}`);
    return ok({ enrollment }, 'Enrolled successfully', 201);
  } catch (e: any) {
    console.error('[enroll] Error during enrollment:', e);
    return err(e.message || 'Enrollment failed', 500);
  }
}

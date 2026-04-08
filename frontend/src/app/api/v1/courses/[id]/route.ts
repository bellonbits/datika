import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, forbidden, ok, err } from '@/lib/db/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true } },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: { id: true, title: true, type: true, order: true, duration: true, isPreview: true },
            },
          },
        },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) return err('Course not found', 404);

    let isEnrolled = false;
    const auth = await getAuthUser(req);
    if (auth) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { studentId_courseId: { studentId: auth.sub, courseId: params.id } },
      });
      isEnrolled = !!enrollment;
    }

    return ok({ ...course, isEnrolled });
  } catch (e) {
    console.error('[course GET]', e);
    return err('Failed to fetch course', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();

  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      select: { instructorId: true }
    });

    if (!course) return err('Course not found', 404);

    // Only instructor or admin can update
    if (auth.role !== 'ADMIN' && course.instructorId !== auth.sub) {
      return forbidden();
    }

    const body = await req.json();
    const updated = await prisma.course.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        price: body.price !== undefined ? body.price : undefined,
        level: body.level,
        status: body.status,
        category: body.category,
        duration: body.duration,
        tags: body.tags,
      },
    });

    return ok({ data: updated }, 'Course updated successfully');
  } catch (e) {
    console.error('[course PATCH]', e);
    return err('Failed to update course', 500);
  }
}

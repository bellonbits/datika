import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, forbidden, ok, err } from '@/lib/db/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { enrollmentId: string; lessonId: string } }
) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: params.enrollmentId },
      include: { course: { include: { sections: { include: { lessons: { select: { id: true } } } } } } },
    });
    if (!enrollment) return err('Enrollment not found', 404);
    if (enrollment.studentId !== auth.sub) return forbidden();

    await prisma.lessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: params.enrollmentId, lessonId: params.lessonId } },
      create: { enrollmentId: params.enrollmentId, lessonId: params.lessonId, completed: true, completedAt: new Date() },
      update: { completed: true, completedAt: new Date() },
    });

    const allLessonIds = enrollment.course.sections.flatMap((s) => s.lessons.map((l) => l.id));
    const completedCount = await prisma.lessonProgress.count({
      where: { enrollmentId: params.enrollmentId, completed: true },
    });
    const progress = allLessonIds.length > 0
      ? Math.round((completedCount / allLessonIds.length) * 100)
      : 0;

    await prisma.enrollment.update({
      where: { id: params.enrollmentId },
      data: {
        progress,
        status: progress === 100 ? 'COMPLETED' : 'ACTIVE',
        completedAt: progress === 100 ? new Date() : null,
      },
    });

    return ok({ progress, lessonId: params.lessonId, completed: true });
  } catch (e) {
    console.error('[lesson complete]', e);
    return err('Failed to mark lesson complete', 500);
  }
}

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentEnrollments(studentId: string) {
    return this.prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            instructor: { select: { id: true, name: true, avatarUrl: true } },
            _count: { select: { sections: true } },
          },
        },
        lessonProgress: { select: { completed: true } },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async markLessonComplete(enrollmentId: string, lessonId: string, studentId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            sections: { include: { lessons: { select: { id: true } } } },
          },
        },
        lessonProgress: true,
      },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    if (enrollment.studentId !== studentId) throw new ForbiddenException('Not authorized');

    // Upsert lesson progress
    await this.prisma.lessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
      create: { enrollmentId, lessonId, completed: true, completedAt: new Date() },
      update: { completed: true, completedAt: new Date() },
    });

    // Recalculate overall progress
    const allLessonIds = enrollment.course.sections.flatMap((s) => s.lessons.map((l) => l.id));
    const completedCount = await this.prisma.lessonProgress.count({
      where: { enrollmentId, completed: true },
    });
    const progress = allLessonIds.length > 0
      ? Math.round((completedCount / allLessonIds.length) * 100)
      : 0;

    await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress,
        completedAt: progress === 100 ? new Date() : null,
        status: progress === 100 ? 'COMPLETED' : 'ACTIVE',
      },
    });

    return { progress, lessonId, completed: true };
  }

  async getCourseStudents(courseId: string, instructorId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.instructorId !== instructorId) {
      throw new ForbiddenException('Not authorized to view this course\'s students');
    }
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }
}

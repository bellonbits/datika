import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async createLesson(sectionId: string, dto: CreateLessonDto, userId: string, role: Role) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });
    if (!section) throw new NotFoundException('Section not found');
    if (section.course.instructorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('Not authorized');
    }
    return this.prisma.lesson.create({ data: { ...dto, sectionId } });
  }

  async getLesson(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        aiNotes: true,
        quiz: true,
        assignment: true,
        section: { include: { course: true } },
      },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    // Check access: preview or enrolled
    if (!lesson.isPreview) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: userId,
            courseId: lesson.section.courseId,
          },
        },
      });
      if (!enrollment) throw new ForbiddenException('Enroll in this course to access this lesson');
    }

    return lesson;
  }

  async updateLesson(lessonId: string, dto: UpdateLessonDto, userId: string, role: Role) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    if (lesson.section.course.instructorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('Not authorized');
    }
    return this.prisma.lesson.update({ where: { id: lessonId }, data: dto });
  }
}

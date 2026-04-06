import {
  Injectable, NotFoundException, ForbiddenException, ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto, CreateSectionDto } from './dto/course.dto';
import { CourseStatus, Role } from '@prisma/client';
import slugify from 'slugify';

function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
}

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 12, level?: string, search?: string) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { status: CourseStatus.PUBLISHED };
    if (level) where.level = level;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          instructor: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { enrollments: true, sections: true } },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return { courses, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByInstructor(instructorId: string) {
    return this.prisma.course.findMany({
      where: { instructorId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { enrollments: true, sections: true } },
        sections: { include: { _count: { select: { lessons: true } } } },
      },
    });
  }

  async findOne(id: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true } },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true, title: true, type: true, order: true,
                duration: true, isPreview: true,
              },
            },
          },
        },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) throw new NotFoundException('Course not found');

    let isEnrolled = false;
    if (userId) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: { studentId_courseId: { studentId: userId, courseId: id } },
      });
      isEnrolled = !!enrollment;
    }

    return { ...course, isEnrolled };
  }

  async create(dto: CreateCourseDto, instructorId: string) {
    const slug = generateSlug(dto.title);
    return this.prisma.course.create({
      data: {
        ...dto,
        slug,
        instructorId,
        status: CourseStatus.DRAFT,
      },
    });
  }

  async update(id: string, dto: UpdateCourseDto, userId: string, role: Role) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('Only the course instructor or admin can edit this course');
    }
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  async delete(id: string, userId: string, role: Role) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('Not authorized');
    }
    return this.prisma.course.delete({ where: { id } });
  }

  async createSection(courseId: string, dto: CreateSectionDto, userId: string, role: Role) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('Not authorized');
    }
    return this.prisma.section.create({ data: { ...dto, courseId } });
  }

  async enrollStudent(courseId: string, studentId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const existing = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
    if (existing) {
      return { message: 'Already enrolled', enrollment: existing };
    }

    if (course.price && course.price > 0) {
      throw new ForbiddenException('This course requires payment. Use the payment flow to enroll.');
    }

    const enrollment = await this.prisma.enrollment.create({
      data: { studentId, courseId, status: 'ACTIVE', progress: 0 },
    });
    return { message: 'Enrolled successfully', enrollment };
  }

  async getAdminStats() {
    const [total, published, draft, totalEnrollments, totalRevenue] = await Promise.all([
      this.prisma.course.count(),
      this.prisma.course.count({ where: { status: CourseStatus.PUBLISHED } }),
      this.prisma.course.count({ where: { status: CourseStatus.DRAFT } }),
      this.prisma.enrollment.count(),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);
    return {
      total, published, draft,
      totalEnrollments,
      totalRevenue: totalRevenue._sum.amount ?? 0,
    };
  }
}

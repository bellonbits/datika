import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CourseStatus, LessonType, CourseLevel } from '@prisma/client';
import slugify from 'slugify';

function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
}

@Injectable()
export class CoursesAiService {
  constructor(private readonly prisma: PrismaService) {}

  async createFromBlueprint(
    instructorId: string,
    data: {
      title: string;
      description: string;
      category: string;
      level: string;
      duration?: string;
      price?: number;
      tags: string[];
      sections: {
        title: string;
        lessons: { title: string; type: string }[];
      }[];
    }
  ) {
    const slug = generateSlug(data.title);

    return this.prisma.$transaction(async (tx) => {
      // 1. Create Course
      const course = await tx.course.create({
        data: {
          title: data.title,
          description: data.description,
          category: data.category,
          duration: data.duration,
          level: (data.level as CourseLevel) || CourseLevel.BEGINNER,
          tags: data.tags,
          slug,
          instructorId,
          status: CourseStatus.DRAFT,
          price: data.price ?? 0, 
        } as any,
      });

      // 2. Create Sections and Lessons
      for (let i = 0; i < data.sections.length; i++) {
        const s = data.sections[i];
        const section = await tx.section.create({
          data: {
            title: s.title,
            order: i + 1,
            courseId: course.id,
          },
        });

        for (let j = 0; j < s.lessons.length; j++) {
          const l = s.lessons[j];
          await tx.lesson.create({
            data: {
              title: l.title,
              type: (l.type as LessonType) || LessonType.VIDEO,
              order: j + 1,
              sectionId: section.id,
            },
          });
        }
      }

      return course;
    });
  }
}

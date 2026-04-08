import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, forbidden, ok, err } from '@/lib/db/auth';

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  if (auth.role !== 'INSTRUCTOR' && auth.role !== 'ADMIN') return forbidden();

  try {
    const blueprint = await req.json();
    const { title, description, category, level, price, duration, sections } = blueprint;

    if (!title) return err('Title is required', 400);

    // Create course with sections and lessons in a transaction
    const course = await prisma.$transaction(async (tx) => {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + Date.now();

      const newCourse = await tx.course.create({
        data: {
          title,
          slug,
          description: description ?? '',
          category: category ?? 'General',
          level: level ?? 'BEGINNER',
          price: price ? parseFloat(String(price)) : 0,
          duration: duration ?? null,
          status: 'DRAFT',
          instructorId: auth.sub,
        },
      });

      if (Array.isArray(sections)) {
        for (let sIdx = 0; sIdx < sections.length; sIdx++) {
          const sec = sections[sIdx];
          const section = await tx.section.create({
            data: {
              title: sec.title,
              order: sIdx + 1,
              courseId: newCourse.id,
            },
          });

          if (Array.isArray(sec.lessons)) {
            for (let lIdx = 0; lIdx < sec.lessons.length; lIdx++) {
              const lesson = sec.lessons[lIdx];
              await tx.lesson.create({
                data: {
                  title: lesson.title,
                  type: lesson.type ?? 'TEXT',
                  order: lIdx + 1,
                  sectionId: section.id,
                  content: lesson.content ?? '',
                  duration: lesson.duration ?? null,
                  isPreview: lIdx === 0, // first lesson of each section is free preview
                },
              });
            }
          }
        }
      }

      return newCourse;
    });

    return ok({ id: course.id, title: course.title, status: course.status }, 'Course created', 201);
  } catch (e) {
    console.error('[courses/ai-bulk POST]', e);
    return err('Failed to create course', 500);
  }
}

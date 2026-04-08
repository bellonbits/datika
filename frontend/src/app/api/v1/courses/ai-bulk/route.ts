import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, forbidden, ok, err } from '@/lib/db/auth';
import { searchEducationalVideo } from '@/lib/db/youtube';
import { generateLessonNotes } from '@/lib/db/lesson-ai';

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  if (auth.role !== 'INSTRUCTOR' && auth.role !== 'ADMIN') return forbidden();

  try {
    const blueprint = await req.json();
    const { title, description, category, level, price, duration, sections } = blueprint;

    if (!title) return err('Title is required', 400);

    const slug =
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') +
      '-' + Date.now();

    // ── 1. Enrich every lesson with YouTube video + AI notes in parallel ──
    let courseThumbnail: string | null = null;

    const enrichedSections = await Promise.all(
      (sections ?? []).map(async (sec: any, sIdx: number) => {
        const enrichedLessons = await Promise.all(
          (sec.lessons ?? []).map(async (lesson: any, lIdx: number) => {
            // Run YouTube search and AI notes generation in parallel
            const [video, notes] = await Promise.all([
              searchEducationalVideo(`${lesson.title} ${category ?? ''}`),
              generateLessonNotes(lesson.title, title, level ?? 'BEGINNER'),
            ]);

            // Use the very first video's thumbnail as the course cover
            if (!courseThumbnail && video?.thumbnail) {
              courseThumbnail = video.thumbnail;
            }

            return {
              ...lesson,
              videoUrl: video?.embedUrl ?? null,
              videoMeta: video
                ? {
                    videoId: video.videoId,
                    ytTitle: video.title,
                    channel: video.channelTitle,
                    thumbnail: video.thumbnail,
                    watchUrl: video.watchUrl,
                    duration: video.duration,
                  }
                : null,
              content: notes,
              durationSec: lesson.duration ?? null,
              isPreview: sIdx === 0 && lIdx === 0,
            };
          }),
        );
        return { ...sec, lessons: enrichedLessons };
      }),
    );

    // ── 2. Persist everything in a single transaction ──
    const course = await prisma.$transaction(async (tx) => {
      const newCourse = await tx.course.create({
        data: {
          title,
          slug,
          description: description ?? '',
          thumbnail: courseThumbnail ?? null,
          category: category ?? 'General',
          level: level ?? 'BEGINNER',
          price: price ? parseFloat(String(price)) : 0,
          duration: duration ?? null,
          status: 'DRAFT',
          instructorId: auth.sub,
        },
      });

      for (let sIdx = 0; sIdx < enrichedSections.length; sIdx++) {
        const sec = enrichedSections[sIdx];
        const section = await tx.section.create({
          data: {
            title: sec.title,
            order: sIdx + 1,
            courseId: newCourse.id,
          },
        });

        for (let lIdx = 0; lIdx < (sec.lessons ?? []).length; lIdx++) {
          const lesson = sec.lessons[lIdx];
          await tx.lesson.create({
            data: {
              title: lesson.title,
              type: lesson.videoUrl ? 'VIDEO' : (lesson.type ?? 'TEXT'),
              order: lIdx + 1,
              sectionId: section.id,
              content: lesson.content ?? '',
              videoUrl: lesson.videoUrl ?? null,
              duration: lesson.durationSec ?? null,
              isPreview: lesson.isPreview,
            },
          });
        }
      }

      return newCourse;
    });

    return ok(
      {
        id: course.id,
        title: course.title,
        status: course.status,
        thumbnail: course.thumbnail,
      },
      'Course created with AI content and YouTube videos',
      201,
    );
  } catch (e) {
    console.error('[courses/ai-bulk POST]', e);
    return err('Failed to create course', 500);
  }
}

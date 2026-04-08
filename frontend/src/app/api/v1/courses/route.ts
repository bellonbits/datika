import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, forbidden, ok, err } from '@/lib/db/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '12'));
    const level = searchParams.get('level') ?? undefined;
    const search = searchParams.get('search') ?? undefined;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: 'PUBLISHED' };
    if (level) where.level = level;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          instructor: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { enrollments: true, sections: true } },
        },
      }),
      prisma.course.count({ where }),
    ]);

    return ok({ courses, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (e) {
    console.error('[courses GET]', e);
    return err('Failed to fetch courses', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  if (auth.role !== 'INSTRUCTOR' && auth.role !== 'ADMIN') return forbidden();

  try {
    const body = await req.json();
    const { title, description, category, level, price } = body;

    if (!title || title.length < 3) return err('Title is required (min 3 chars)', 400);

    const course = await prisma.course.create({
      data: {
        title,
        description: description ?? '',
        category: category ?? 'General',
        level: level ?? 'BEGINNER',
        price: price ? parseFloat(price) : 0,
        status: 'DRAFT',
        instructorId: auth.sub,
      },
    });

    return ok(course, 'Course created', 201);
  } catch (e) {
    console.error('[courses POST]', e);
    return err('Failed to create course', 500);
  }
}

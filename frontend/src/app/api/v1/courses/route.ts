import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { ok, err } from '@/lib/db/auth';

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

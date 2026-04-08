import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, forbidden, ok, err } from '@/lib/db/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  if (auth.role !== 'ADMIN') return forbidden();

  try {
    const [total, published, totalEnrollments, revenueAgg] = await Promise.all([
      prisma.course.count(),
      prisma.course.count({ where: { status: 'PUBLISHED' } }),
      prisma.enrollment.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      }),
    ]);

    const totalRevenue = revenueAgg._sum.amount?.toNumber() ?? 0;

    return ok({ total, published, totalEnrollments, totalRevenue });
  } catch (e) {
    console.error('[courses/admin/stats GET]', e);
    return err('Failed to fetch course stats', 500);
  }
}

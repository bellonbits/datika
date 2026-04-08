import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, forbidden, ok, err } from '@/lib/db/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  if (auth.role !== 'ADMIN') return forbidden();

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') ?? '30');
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [recentPayments, totalRevenue, monthlyRevenue] = await Promise.all([
      prisma.payment.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
        },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED', createdAt: { gte: since } },
      }),
    ]);

    return ok({
      recentPayments,
      totalRevenue: totalRevenue._sum.amount?.toNumber() ?? 0,
      periodRevenue: monthlyRevenue._sum.amount?.toNumber() ?? 0,
      days,
    });
  } catch (e) {
    console.error('[payments/admin/revenue GET]', e);
    return err('Failed to fetch revenue', 500);
  }
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, err, ok } from '@/lib/db/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        course: { select: { title: true } },
      },
    });

    if (!payment) return err('Payment not found', 404);
    if (payment.userId !== auth.sub && auth.role !== 'ADMIN') return err('Forbidden', 403);

    return ok(payment);
  } catch (e) {
    console.error('[payments/status]', e);
    return err('Failed to fetch payment status', 500);
  }
}

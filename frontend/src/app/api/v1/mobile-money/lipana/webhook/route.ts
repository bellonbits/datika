import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { lipanaService, LipanaWebhookPayload } from '@/lib/db/lipana';
import { ok, err } from '@/lib/db/auth';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-lipana-signature') || '';

    if (!lipanaService.verifyWebhookSignature(signature, rawBody)) {
      console.warn('[Webhook] Invalid signature');
      return err('Invalid signature', 403);
    }

    const body: LipanaWebhookPayload = JSON.parse(rawBody);
    const parsed = lipanaService.parseWebhook(body);

    console.log(`[Webhook] Lipana event=${parsed.event} transaction=${parsed.transactionId}`);

    // Match by checkoutRequestID stored during initiation
    const payment = await prisma.payment.findUnique({
      where: { checkoutRequestId: parsed.checkoutRequestID },
    });

    if (!payment) {
      console.warn(`[Webhook] No payment found for checkoutRequestID=${parsed.checkoutRequestID}`);
      return ok({ received: true }); // Return OK to Lipana to stop retries
    }

    // Idempotency — skip if already processed
    if (payment.status === 'COMPLETED') {
      return ok({ already_processed: true });
    }

    if (parsed.success) {
      // Use a transaction to atomically mark paid + enroll
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            mpesaReceiptNumber: parsed.transactionId,
            paidAt: new Date(),
          },
        }),
        prisma.enrollment.upsert({
          where: {
            studentId_courseId: { studentId: payment.userId, courseId: payment.courseId },
          },
          create: { 
            studentId: payment.userId, 
            courseId: payment.courseId, 
            status: 'ACTIVE' 
          },
          update: { status: 'ACTIVE' },
        }),
      ]);
      console.log(`[Webhook] Payment ${payment.id} completed. Student ${payment.userId} enrolled in ${payment.courseId}.`);
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', metadata: { event: parsed.event } },
      });
      console.log(`[Webhook] Payment ${payment.id} marked FAILED (event=${parsed.event})`);
    }

    return ok({ processed: true });
  } catch (e) {
    console.error('[Webhook Error]', e);
    return err('Webhook processing failed', 500);
  }
}

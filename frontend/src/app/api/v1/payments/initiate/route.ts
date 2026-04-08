import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, err, ok } from '@/lib/db/auth';
import { lipanaService } from '@/lib/db/lipana';

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();

  try {
    const { courseId, phoneNumber } = await req.json();
    if (!courseId || !phoneNumber) return err('Course ID and phone number are required');

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return err('Course not found', 404);

    const existing = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: auth.sub, courseId } },
    });
    if (existing) return err('You are already enrolled in this course', 400);

    // Free course — enroll directly
    if (Number(course.price) === 0) {
      await prisma.enrollment.create({
        data: { studentId: auth.sub, courseId, status: 'ACTIVE' },
      });
      return ok({ requiresPayment: false }, 'Enrolled successfully');
    }

    // Create pending payment record
    const payment = await prisma.payment.create({
      data: {
        userId: auth.sub,
        courseId,
        amount: course.price,
        currency: course.currency || 'KES',
        phoneNumber,
        status: 'PENDING',
        provider: 'lipana',
      },
    });

    // Initiate STK Push via Lipana
    try {
      const stkResult = await lipanaService.initiateSTKPush({
        phoneNumber,
        amount: Number(course.price),
      });

      // Store Lipana's checkoutRequestID for webhook matching
      await prisma.payment.update({
        where: { id: payment.id },
        data: { checkoutRequestId: stkResult.checkoutRequestID },
      });

      return ok({
        requiresPayment: true,
        paymentId: payment.id,
        transactionId: stkResult.transactionId,
        checkoutRequestID: stkResult.checkoutRequestID,
        customerMessage: stkResult.CustomerMessage,
      }, 'Payment initiated');
    } catch (lipanaErr: any) {
      console.error('[Lipana Error]', lipanaErr);
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', metadata: { error: lipanaErr.message } },
      });
      return err(lipanaErr.message || 'Payment initiation failed', 400);
    }
  } catch (e) {
    console.error('[payments/initiate]', e);
    return err('Failed to initiate payment', 500);
  }
}

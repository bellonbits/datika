import {
  Injectable, NotFoundException, BadRequestException, Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LipanaService, LipanaWebhookPayload } from './lipana.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly lipana: LipanaService,
  ) {}

  async initiateCoursePayment(params: {
    userId: string;
    courseId: string;
    phoneNumber: string;
  }) {
    const course = await this.prisma.course.findUnique({ where: { id: params.courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const existing = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: params.userId, courseId: params.courseId } },
    });
    if (existing) throw new BadRequestException('You are already enrolled in this course');

    // Free course — enroll directly
    if (Number(course.price) === 0) {
      await this.prisma.enrollment.create({
        data: { studentId: params.userId, courseId: params.courseId },
      });
      return { requiresPayment: false, message: 'Enrolled successfully' };
    }

    // Create pending payment record
    const payment = await this.prisma.payment.create({
      data: {
        userId: params.userId,
        courseId: params.courseId,
        amount: course.price,
        currency: course.currency,
        phoneNumber: params.phoneNumber,
        status: 'PENDING',
        provider: 'lipana',
      },
    });

    // Initiate STK Push via Lipana
    const stkResult = await this.lipana.initiateSTKPush({
      phoneNumber: params.phoneNumber,
      amount: Number(course.price),
    });

    // Store Lipana's checkoutRequestID for webhook matching
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { checkoutRequestId: stkResult.checkoutRequestID },
    });

    return {
      requiresPayment: true,
      paymentId: payment.id,
      transactionId: stkResult.transactionId,
      checkoutRequestID: stkResult.checkoutRequestID,
      message: stkResult.CustomerMessage,
    };
  }

  /**
   * Handle verified Lipana webhook.
   * Signature verification is done in the controller using raw body.
   */
  async handleLipanaWebhook(body: LipanaWebhookPayload): Promise<void> {
    const parsed = this.lipana.parseWebhook(body);
    this.logger.log(`Lipana webhook [${parsed.event}] txn=${parsed.transactionId}`);

    // Match by checkoutRequestID stored during initiation
    const payment = await this.prisma.payment.findUnique({
      where: { checkoutRequestId: parsed.checkoutRequestID },
    });

    if (!payment) {
      this.logger.warn(`No payment found for checkoutRequestID=${parsed.checkoutRequestID}`);
      return;
    }

    // Idempotency — skip if already processed
    if (payment.status === 'COMPLETED') {
      this.logger.log(`Payment ${payment.id} already completed — skipping duplicate webhook`);
      return;
    }

    if (parsed.success) {
      // Use a transaction to atomically mark paid + enroll
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            mpesaReceiptNumber: parsed.transactionId,
            paidAt: new Date(),
          },
        }),
        this.prisma.enrollment.upsert({
          where: {
            studentId_courseId: { studentId: payment.userId, courseId: payment.courseId },
          },
          create: { studentId: payment.userId, courseId: payment.courseId, status: 'ACTIVE' },
          update: { status: 'ACTIVE' },
        }),
      ]);
      this.logger.log(`Payment ${payment.id} completed — student ${payment.userId} enrolled`);
    } else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', metadata: { event: parsed.event } },
      });
      this.logger.log(`Payment ${payment.id} marked FAILED (event=${parsed.event})`);
    }
  }

  async checkPaymentStatus(paymentId: string, userId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.userId !== userId) throw new NotFoundException('Payment not found');

    if (payment.status === 'PENDING' && payment.checkoutRequestId) {
      const live = await this.lipana.getTransactionStatus(payment.checkoutRequestId);
      return { payment, liveStatus: live };
    }

    return { payment };
  }

  async getRevenueStats() {
    const [total, monthly, payments] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          paidAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.payment.findMany({
        where: { status: 'COMPLETED' },
        orderBy: { paidAt: 'desc' },
        take: 10,
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
        },
      }),
    ]);

    return {
      totalRevenue: total._sum.amount ?? 0,
      totalTransactions: total._count,
      monthlyRevenue: monthly._sum.amount ?? 0,
      monthlyTransactions: monthly._count,
      recentPayments: payments,
    };
  }
}

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async issueCertificate(userId: string, courseId: string): Promise<{
    certificateId: string;
    verificationCode: string;
    pdfUrl: string;
  }> {
    // Verify enrollment is complete
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: userId, courseId } },
      include: { course: true },
    });

    if (!enrollment) throw new NotFoundException('Enrollment not found');
    if (enrollment.status !== 'COMPLETED') {
      throw new BadRequestException('Course must be completed before certificate can be issued');
    }

    // Check if certificate already exists
    const existing = await this.prisma.certificate.findFirst({
      where: { userId, courseId },
    });
    if (existing) return { certificateId: existing.id, verificationCode: existing.verificationCode, pdfUrl: existing.pdfUrl };

    // Generate unique verification code
    const verificationCode = crypto.randomBytes(16).toString('hex').toUpperCase();

    // TODO: Generate actual PDF using puppeteer and upload to S3
    // For now, store a placeholder URL that the PDF generation job will fulfill
    const pdfUrl = `${this.config.get('FRONTEND_URL')}/certificates/verify/${verificationCode}`;

    const certificate = await this.prisma.certificate.create({
      data: { userId, courseId, verificationCode, pdfUrl },
    });

    return { certificateId: certificate.id, verificationCode, pdfUrl };
  }

  async verifyCertificate(verificationCode: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { verificationCode },
      include: {
        user: { select: { name: true } },
      },
    });
    if (!certificate) throw new NotFoundException('Certificate not found or invalid');

    const course = await this.prisma.course.findUnique({
      where: { id: certificate.courseId },
      select: { title: true, level: true },
    });

    return {
      valid: true,
      studentName: certificate.user.name,
      courseName: course?.title,
      courseLevel: course?.level,
      issuedAt: certificate.issuedAt,
      verificationCode,
    };
  }

  async getUserCertificates(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });
  }
}

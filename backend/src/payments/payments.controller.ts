import {
  Controller, Post, Get, Body, Param, Req, UseGuards,
  HttpCode, HttpStatus, ParseUUIDPipe, UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { LipanaService, LipanaWebhookPayload } from './lipana.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

class InitiatePaymentDto {
  @ApiProperty({ example: 'uuid-of-course' })
  @IsUUID()
  courseId: string;

  @ApiProperty({ example: '0712345678', description: 'Kenyan phone number (M-Pesa registered)' })
  @IsString()
  phoneNumber: string;
}

@ApiTags('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly lipanaService: LipanaService,
  ) {}

  @Post('initiate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate Lipana M-Pesa STK Push for course enrollment' })
  initiate(
    @Body() dto: InitiatePaymentDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.paymentsService.initiateCoursePayment({
      userId: user.id,
      courseId: dto.courseId,
      phoneNumber: dto.phoneNumber,
    });
  }

  /**
   * Lipana webhook endpoint.
   * Uses express.raw() middleware to capture raw body for HMAC signature verification.
   * Register in main.ts: app.use('/api/v1/payments/webhook', express.raw({ type: '*\/*' }))
   */
  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lipana payment webhook (Lipana servers only)' })
  async lipanaWebhook(@Req() req: Request, @Body() body: LipanaWebhookPayload) {
    const signature = req.headers['x-lipana-signature'] as string;
    // rawBody is attached by the express.raw() middleware
    const rawBody: Buffer = (req as Request & { rawBody?: Buffer }).rawBody ?? Buffer.from(JSON.stringify(body));

    const valid = this.lipanaService.verifyWebhookSignature(signature, rawBody);
    if (!valid) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    await this.paymentsService.handleLipanaWebhook(body);
    return { received: true };
  }

  @Get('status/:paymentId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check payment status by payment ID' })
  checkStatus(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.paymentsService.checkPaymentStatus(paymentId, user.id);
  }

  @Get('admin/revenue')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get revenue statistics (Admin only)' })
  getRevenue() {
    return this.paymentsService.getRevenueStats();
  }
}

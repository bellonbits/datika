import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';

export interface LipanaStkResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    status: 'pending' | 'success' | 'failed';
    checkoutRequestID: string;
    message: string;
  };
}

export interface LipanaWebhookPayload {
  event: 'payment.success' | 'payment.failed' | 'payment.pending';
  data: {
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
    phone: string;
    checkoutRequestID: string;
    timestamp: string;
  };
}

@Injectable()
export class LipanaService {
  private readonly logger = new Logger(LipanaService.name);
  private readonly http: AxiosInstance;
  private readonly webhookSecret: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = config.get<string>('LIPANA_SECRET_KEY', '');
    const baseURL = config.get<string>('LIPANA_BASE_URL', 'https://api.lipana.dev/v1');
    this.webhookSecret = config.get<string>('LIPANA_WEBHOOK_SECRET', '');

    this.http = axios.create({
      baseURL,
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Initiate STK Push via Lipana REST API.
   * Phone: +254712345678 or 254712345678 — both accepted.
   * Minimum amount: KES 10.
   */
  async initiateSTKPush(params: {
    phoneNumber: string;
    amount: number;
  }): Promise<LipanaStkResponse['data'] & { CustomerMessage: string }> {
    // Normalize to +254XXXXXXXXX
    let phone = params.phoneNumber.trim().replace(/\s/g, '');
    if (phone.startsWith('0')) phone = '+254' + phone.slice(1);
    else if (phone.startsWith('254')) phone = '+' + phone;
    else if (!phone.startsWith('+')) phone = '+254' + phone;

    const amount = Math.ceil(params.amount);
    if (amount < 10) throw new BadRequestException('Minimum payment amount is KES 10');

    try {
      this.logger.log(`STK Push → ${phone} KES ${amount}`);
      const res = await this.http.post<LipanaStkResponse>(
        '/transactions/push-stk',
        { phone, amount },
      );

      if (!res.data.success) {
        throw new BadRequestException(res.data.message ?? 'STK Push failed');
      }

      return {
        ...res.data.data,
        CustomerMessage: 'STK push sent. Please enter your M-Pesa PIN to complete payment.',
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (error as Error).message;
      this.logger.error(`Lipana STK Push error: ${msg}`);
      throw new BadRequestException(`Payment initiation failed. ${msg}`);
    }
  }

  /**
   * Verify the X-Lipana-Signature header using HMAC-SHA256.
   * rawBody must be the raw request buffer (before JSON parsing).
   */
  verifyWebhookSignature(signature: string, rawBody: Buffer): boolean {
    if (!this.webhookSecret) {
      this.logger.warn('LIPANA_WEBHOOK_SECRET not configured — skipping verification');
      return true;
    }
    if (!signature) return false;
    try {
      const expected = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(rawBody)
        .digest('hex');
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch {
      return false;
    }
  }

  /**
   * Parse a verified Lipana webhook payload.
   */
  parseWebhook(body: LipanaWebhookPayload) {
    return {
      transactionId: body.data.transactionId,
      checkoutRequestID: body.data.checkoutRequestID,
      success: body.event === 'payment.success',
      amount: body.data.amount,
      phone: body.data.phone,
      event: body.event,
    };
  }

  /**
   * Fetch transaction status by Lipana transactionId.
   */
  async getTransactionStatus(transactionId: string): Promise<{ status: string; amount: number }> {
    try {
      const res = await this.http.get(`/transactions/${transactionId}`);
      return res.data as { status: string; amount: number };
    } catch {
      throw new BadRequestException('Could not fetch transaction status');
    }
  }
}

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

export class LipanaService {
  private readonly http: AxiosInstance;
  private readonly webhookSecret: string;

  constructor() {
    const apiKey = process.env.LIPANA_SECRET_KEY || '';
    const baseURL = process.env.LIPANA_BASE_URL || 'https://api.lipana.dev/v1';
    this.webhookSecret = process.env.LIPANA_WEBHOOK_SECRET || '';

    this.http = axios.create({
      baseURL,
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async initiateSTKPush(params: {
    phoneNumber: string;
    amount: number;
  }): Promise<LipanaStkResponse['data'] & { CustomerMessage: string }> {
    let phone = params.phoneNumber.trim().replace(/\s/g, '');
    if (phone.startsWith('0')) phone = '+254' + phone.slice(1);
    else if (phone.startsWith('254')) phone = '+' + phone;
    else if (!phone.startsWith('+')) phone = '+254' + phone;

    const amount = Math.ceil(params.amount);
    if (amount < 10) throw new Error('Minimum payment amount is KES 10');

    try {
      const res = await this.http.post<LipanaStkResponse>(
        '/transactions/push-stk',
        { phone, amount },
      );

      if (!res.data.success) {
        throw new Error(res.data.message ?? 'STK Push failed');
      }

      return {
        ...res.data.data,
        CustomerMessage: 'STK push sent. Please enter your M-Pesa PIN to complete payment.',
      };
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(`Payment initiation failed. ${msg}`);
    }
  }

  verifyWebhookSignature(signature: string, rawBody: string): boolean {
    if (!this.webhookSecret || this.webhookSecret.startsWith('http')) {
      // If it starts with http, it's likely the user incorrectly put the URL in the secret var
      console.warn('LIPANA_WEBHOOK_SECRET not properly configured — skipping verification');
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

  async getTransactionStatus(transactionId: string): Promise<{ status: string; amount: number }> {
    try {
      const res = await this.http.get(`/transactions/${transactionId}`);
      return res.data;
    } catch {
      throw new Error('Could not fetch transaction status');
    }
  }
}

export const lipanaService = new LipanaService();

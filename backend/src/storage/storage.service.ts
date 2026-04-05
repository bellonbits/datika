import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly client: Minio.Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly config: ConfigService) {
    const endpoint = config.get<string>('MINIO_ENDPOINT', 'http://localhost:9000');
    const url = new URL(endpoint);

    this.client = new Minio.Client({
      endPoint: url.hostname,
      port: parseInt(url.port || (url.protocol === 'https:' ? '443' : '9000'), 10),
      useSSL: url.protocol === 'https:',
      accessKey: config.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: config.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
    });

    this.bucket = config.get<string>('MINIO_BUCKET', 'datika-assets');
    this.publicUrl = config.get<string>('MINIO_PUBLIC_URL', endpoint);

    void this.ensureBucket();
  }

  private async ensureBucket(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket);
        // Open read policy for the public/ prefix (thumbnails, certificates)
        await this.client.setBucketPolicy(
          this.bucket,
          JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: { AWS: ['*'] },
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${this.bucket}/public/*`],
              },
            ],
          }),
        );
        this.logger.log(`MinIO bucket '${this.bucket}' created with public read on /public/*`);
      }
    } catch (err) {
      this.logger.warn(`MinIO bucket init: ${(err as Error).message}`);
    }
  }

  /**
   * Upload a Buffer to MinIO.
   * Files under folder 'public/*' are served without authentication.
   */
  async upload(
    file: Buffer,
    options: {
      folder: string;
      filename?: string;
      contentType: string;
      isPublic?: boolean;
    },
  ): Promise<string> {
    const prefix = options.isPublic !== false ? 'public' : 'private';
    const key = `${prefix}/${options.folder}/${options.filename ?? uuidv4()}`;

    try {
      await this.client.putObject(this.bucket, key, file, file.length, {
        'Content-Type': options.contentType,
      });
      return `${this.publicUrl}/${this.bucket}/${key}`;
    } catch (err) {
      this.logger.error(`Upload failed [${key}]: ${(err as Error).message}`);
      throw new InternalServerErrorException('File upload failed');
    }
  }

  /**
   * Generate a time-limited presigned GET URL for private objects.
   */
  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      return await this.client.presignedGetObject(this.bucket, key, expiresIn);
    } catch (err) {
      this.logger.error(`Presign failed [${key}]: ${(err as Error).message}`);
      throw new InternalServerErrorException('Could not generate file URL');
    }
  }

  /**
   * Delete an object. Swallows errors (object may already be gone).
   */
  async delete(key: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucket, key);
    } catch (err) {
      this.logger.warn(`Delete failed [${key}]: ${(err as Error).message}`);
    }
  }
}

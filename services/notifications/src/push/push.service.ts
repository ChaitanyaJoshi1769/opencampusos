import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';

export interface SendPushDto {
  deviceTokens: string | string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  webpush?: {
    data?: Record<string, string>;
    notification?: {
      title?: string;
      body?: string;
      icon?: string;
      badge?: string;
    };
  };
  apns?: {
    headers?: Record<string, string>;
  };
}

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private app: admin.app.App;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      const serviceAccount = process.env.FIREBASE_CONFIG
        ? JSON.parse(process.env.FIREBASE_CONFIG)
        : null;

      if (serviceAccount) {
        this.app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        this.logger.warn('Firebase not configured, push notifications will use mock mode');
      }
    } catch (error) {
      this.logger.warn('Firebase initialization failed, push notifications will use mock mode');
    }
  }

  async sendPush(dto: SendPushDto): Promise<any> {
    if (!dto.deviceTokens || !dto.title || !dto.body) {
      throw new BadRequestException('Device tokens, title, and body are required');
    }

    const tokens = Array.isArray(dto.deviceTokens) ? dto.deviceTokens : [dto.deviceTokens];

    if (!this.app) {
      this.logger.warn('Firebase not configured, returning mock push response');
      return {
        id: 'PUSH-' + Date.now(),
        deviceTokens: dto.deviceTokens,
        status: 'sent',
        sentAt: new Date(),
      };
    }

    try {
      const message = {
        notification: {
          title: dto.title,
          body: dto.body,
        },
        data: dto.data,
        webpush: dto.webpush,
        apns: dto.apns,
      };

      const response = await admin.messaging(this.app).sendMulticast({
        ...message,
        tokens,
      } as any);

      this.logger.log(`✅ Push notifications sent: ${response.successCount} successful, ${response.failureCount} failed`);

      return {
        id: 'PUSH-' + Date.now(),
        deviceTokens: dto.deviceTokens,
        successCount: response.successCount,
        failureCount: response.failureCount,
        status: 'sent',
        sentAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Push notification failed: ${error.message}`);
      throw new BadRequestException(`Push notification failed: ${error.message}`);
    }
  }

  async sendTopicNotification(
    topic: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<any> {
    if (!this.app) {
      this.logger.warn('Firebase not configured, returning mock topic notification response');
      return {
        id: 'PUSH-' + Date.now(),
        topic,
        status: 'sent',
        sentAt: new Date(),
      };
    }

    try {
      const messageId = await admin.messaging(this.app).send({
        notification: { title, body },
        data,
        topic,
      });

      this.logger.log(`✅ Topic notification sent: ${messageId}`);

      return {
        id: messageId,
        topic,
        status: 'sent',
        sentAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Topic notification failed: ${error.message}`);
      throw new BadRequestException(`Topic notification failed: ${error.message}`);
    }
  }

  async subscribeToTopic(deviceTokens: string[], topic: string): Promise<any> {
    if (!this.app) {
      this.logger.warn('Firebase not configured, returning mock subscription response');
      return { subscribed: deviceTokens.length, topic };
    }

    try {
      const response = await admin.messaging(this.app).subscribeToTopic(deviceTokens, topic);

      this.logger.log(`✅ Subscribed to topic: ${topic}`);

      return {
        topic,
        subscribedCount: response.successCount,
        failedCount: response.failureCount,
      };
    } catch (error) {
      this.logger.error(`Topic subscription failed: ${error.message}`);
      throw new BadRequestException(`Topic subscription failed: ${error.message}`);
    }
  }
}

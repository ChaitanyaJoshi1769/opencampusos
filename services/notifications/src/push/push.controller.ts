import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { PushService, SendPushDto } from './push.service';

@Controller('v1/push')
export class PushController {
  constructor(private readonly service: PushService) {}

  @Post('send')
  @HttpCode(201)
  async send(@Body() dto: SendPushDto): Promise<{ status: string; data: any }> {
    const result = await this.service.sendPush(dto);
    return { status: 'success', data: result };
  }

  @Post('topic')
  @HttpCode(201)
  async sendToTopic(
    @Body() body: { topic: string; title: string; body: string; data?: Record<string, string> },
  ): Promise<{ status: string; data: any }> {
    const result = await this.service.sendTopicNotification(body.topic, body.title, body.body, body.data);
    return { status: 'success', data: result };
  }

  @Post('subscribe')
  @HttpCode(201)
  async subscribeTopic(
    @Body() body: { deviceTokens: string[]; topic: string },
  ): Promise<{ status: string; data: any }> {
    const result = await this.service.subscribeToTopic(body.deviceTokens, body.topic);
    return { status: 'success', data: result };
  }
}

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { EventService } from '../services/event.service';

@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('publish')
  async publishEvent(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.eventService.publishEvent(tenantId, body);
  }

  @Get()
  async getEvents(
    @Headers('x-tenant-id') tenantId: string,
    @Query('type') type?: string,
    @Query('limit') limit: number = 100,
  ) {
    return this.eventService.getEvents(tenantId, type, limit);
  }

  @Get('stats')
  async getStats(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.eventService.getEventStats(tenantId);
  }

  @Post('subscribe')
  async subscribe(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: { eventType: string; endpoint: string },
  ) {
    return this.eventService.subscribeToEvent(tenantId, body.eventType, body.endpoint);
  }

  @Get('subscribers')
  async getSubscribers(
    @Headers('x-tenant-id') tenantId: string,
    @Query('eventType') eventType?: string,
  ) {
    return this.eventService.getSubscribers(tenantId, eventType);
  }

  @Get(':eventId/delivery-status')
  async getDeliveryStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.eventService.getDeliveryStatus(tenantId, eventId);
  }
}

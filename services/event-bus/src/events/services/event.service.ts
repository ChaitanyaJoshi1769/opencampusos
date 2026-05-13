import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventService {
  private logger = new Logger(EventService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  async publishEvent(tenantId: string, event: any) {
    this.logger.log(`Publishing event: ${event.type}`);

    const savedEvent = await this.prisma.event.create({
      data: {
        tenantId,
        type: event.type,
        source: event.source,
        payload: event.payload,
        status: 'published',
        publishedAt: new Date(),
      },
    });

    this.eventEmitter.emit(event.type, event);

    return savedEvent;
  }

  async getEvents(tenantId: string, type?: string, limit: number = 100) {
    const where: any = { tenantId };
    if (type) where.type = type;

    return this.prisma.event.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  async getEventStats(tenantId: string) {
    const events = await this.prisma.event.findMany({ where: { tenantId } });

    const byType: { [key: string]: number } = {};
    events.forEach((e) => {
      byType[e.type] = (byType[e.type] || 0) + 1;
    });

    return {
      totalEvents: events.length,
      byType,
      types: Object.keys(byType),
    };
  }

  async subscribeToEvent(tenantId: string, eventType: string, endpoint: string) {
    this.logger.log(`Subscribing to ${eventType} at ${endpoint}`);

    return this.prisma.subscriber.create({
      data: {
        tenantId,
        eventType,
        endpoint,
        active: true,
      },
    });
  }

  async getSubscribers(tenantId: string, eventType?: string) {
    const where: any = { tenantId, active: true };
    if (eventType) where.eventType = eventType;

    return this.prisma.subscriber.findMany({ where });
  }

  async deliverEvent(eventId: string, subscriberId: string) {
    this.logger.log(`Delivering event ${eventId} to subscriber ${subscriberId}`);

    return this.prisma.eventDelivery.create({
      data: {
        eventId,
        subscriberId,
        status: 'delivered',
        deliveredAt: new Date(),
      },
    });
  }

  async getDeliveryStatus(tenantId: string, eventId: string) {
    const deliveries = await this.prisma.eventDelivery.findMany({
      where: { eventId },
    });

    const successful = deliveries.filter((d) => d.status === 'delivered').length;
    const failed = deliveries.filter((d) => d.status === 'failed').length;

    return {
      eventId,
      total: deliveries.length,
      successful,
      failed,
      pending: deliveries.length - successful - failed,
    };
  }
}

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { CalendarService, CreateEventDto } from '../services/calendar.service';

@Controller('v1/calendar')
export class CalendarController {
  constructor(private readonly service: CalendarService) {}

  @Post('events')
  @HttpCode(201)
  async createEvent(@Body() dto: CreateEventDto): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const event = await this.service.createEvent(tenantId, dto);

    return { status: 'success', data: event };
  }

  @Get('events/:id')
  @HttpCode(200)
  async getEvent(@Param('id') id: string): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const event = await this.service.getEvent(tenantId, id);

    return { status: 'success', data: event };
  }

  @Get('events')
  @HttpCode(200)
  async listEvents(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const events = await this.service.listEvents(
      tenantId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    return { status: 'success', data: events };
  }

  @Get('user/:userId/events')
  @HttpCode(200)
  async getUserEvents(@Param('userId') userId: string): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const events = await this.service.listUserEvents(tenantId, userId);

    return { status: 'success', data: events };
  }

  @Patch('events/:id')
  @HttpCode(200)
  async updateEvent(
    @Param('id') id: string,
    @Body() dto: Partial<CreateEventDto>,
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const event = await this.service.updateEvent(tenantId, id, dto);

    return { status: 'success', data: event };
  }

  @Delete('events/:id')
  @HttpCode(200)
  async deleteEvent(@Param('id') id: string): Promise<{ status: string; message: string }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    await this.service.deleteEvent(tenantId, id);

    return { status: 'success', message: 'Event deleted successfully' };
  }

  @Get('conflicts')
  @HttpCode(200)
  async getConflicts(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('excludeEventId') excludeEventId?: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const conflicts = await this.service.getConflicts(
      tenantId,
      new Date(startTime),
      new Date(endTime),
      excludeEventId,
    );

    return { status: 'success', data: conflicts };
  }

  @Get('available-slots')
  @HttpCode(200)
  async findAvailableSlots(
    @Query('duration') duration: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{ status: string; data: any[] }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const slots = await this.service.findAvailableSlots(
      tenantId,
      duration,
      new Date(startDate),
      new Date(endDate),
    );

    return { status: 'success', data: slots };
  }

  @Get(':calendarId/export')
  @HttpCode(200)
  async exportCalendar(
    @Param('calendarId') calendarId: string,
    @Query('format') format: 'ics' | 'json' = 'ics',
  ): Promise<{ status: string; data: any }> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.service.exportCalendar(tenantId, calendarId, format);

    return { status: 'success', data: result };
  }
}

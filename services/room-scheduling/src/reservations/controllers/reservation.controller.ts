import { Controller, Get, Post, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { ReservationService } from '../services/reservation.service';

@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  async createReservation(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.reservationService.createReservation(tenantId, data);
  }

  @Get()
  async listReservations(
    @Query() filters: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.reservationService.listReservations(tenantId, filters);
  }

  @Get('stats')
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.reservationService.getReservationStats(tenantId);
  }

  @Get('user/:userId')
  async getUserReservations(
    @Param('userId') userId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.reservationService.getUserReservations(tenantId, userId);
  }

  @Post('check-conflict')
  async checkConflict(
    @Body() body: { roomId: string; startTime: Date; endTime: Date },
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return {
      hasConflict: await this.reservationService.checkConflict(
        tenantId,
        body.roomId,
        new Date(body.startTime),
        new Date(body.endTime),
      ),
    };
  }

  @Get(':id')
  async getReservation(
    @Param('id') reservationId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.reservationService.getReservation(tenantId, reservationId);
  }

  @Put(':id')
  async updateReservation(
    @Param('id') reservationId: string,
    @Body() data: any,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.reservationService.updateReservation(tenantId, reservationId, data);
  }

  @Post(':id/confirm')
  async confirmReservation(
    @Param('id') reservationId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.reservationService.confirmReservation(tenantId, reservationId);
  }

  @Post(':id/cancel')
  async cancelReservation(
    @Param('id') reservationId: string,
    @Body() body?: { reason?: string },
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.reservationService.cancelReservation(tenantId, reservationId, body?.reason);
  }
}

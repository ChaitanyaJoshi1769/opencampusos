import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { ConnectorService } from '../services/connector.service';

@Controller('connectors')
export class ConnectorController {
  constructor(private connectorService: ConnectorService) {}

  @Post()
  async configureConnector(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.connectorService.configureConnector(tenantId, body.system, body.config);
  }

  @Get(':connectorId')
  async getConnector(
    @Headers('x-tenant-id') tenantId: string,
    @Param('connectorId') connectorId: string,
  ) {
    return this.connectorService.getConnector(tenantId, connectorId);
  }

  @Get()
  async listConnectors(@Headers('x-tenant-id') tenantId: string) {
    return this.connectorService.listConnectors(tenantId);
  }

  @Post(':connectorId/test')
  async testConnection(
    @Headers('x-tenant-id') tenantId: string,
    @Param('connectorId') connectorId: string,
  ) {
    return this.connectorService.testConnection(tenantId, connectorId);
  }

  @Delete(':connectorId')
  async deleteConnector(
    @Headers('x-tenant-id') tenantId: string,
    @Param('connectorId') connectorId: string,
  ) {
    return this.connectorService.deleteConnector(tenantId, connectorId);
  }

  @Get(':connectorId/status')
  async getSyncStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Param('connectorId') connectorId: string,
  ) {
    return this.connectorService.getSyncStatus(tenantId, connectorId);
  }

  @Get('systems/supported')
  async listSupportedSystems() {
    return this.connectorService.listSupportedSystems();
  }
}

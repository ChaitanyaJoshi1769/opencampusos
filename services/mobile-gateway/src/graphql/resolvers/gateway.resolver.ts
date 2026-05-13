import { Resolver, Query, Context } from '@nestjs/graphql';
import { GatewayService } from '../services/gateway.service';

@Resolver()
export class GatewayResolver {
  constructor(private gatewayService: GatewayService) {}

  @Query(() => String)
  async hello() {
    return 'Hello from Mobile GraphQL Gateway!';
  }

  @Query()
  async mobileUser(@Context() context: any) {
    const tenantId = context.req.headers['x-tenant-id'];
    const userId = context.req.headers['x-user-id'];
    return this.gatewayService.aggregateUserData(tenantId, userId);
  }

  @Query()
  async mobileDashboard(@Context() context: any) {
    const tenantId = context.req.headers['x-tenant-id'];
    const userId = context.req.headers['x-user-id'];
    return this.gatewayService.getDashboard(tenantId, userId);
  }

  @Query()
  async search(
    @Context() context: any,
    query: string,
  ) {
    const tenantId = context.req.headers['x-tenant-id'];
    return this.gatewayService.searchAcrossServices(tenantId, query);
  }

  @Query()
  async recommendations(@Context() context: any) {
    const tenantId = context.req.headers['x-tenant-id'];
    const userId = context.req.headers['x-user-id'];
    return this.gatewayService.getRecommendations(tenantId, userId);
  }
}

import { Module } from '@nestjs/common';
import { NLQueryService } from './services/nl-query.service';
import { NLQueryController } from './controllers/nl-query.controller';

@Module({
  providers: [NLQueryService],
  controllers: [NLQueryController],
  exports: [NLQueryService],
})
export class QueryModule {}

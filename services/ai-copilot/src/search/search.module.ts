import { Module } from '@nestjs/common';
import { SemanticSearchService } from './services/semantic-search.service';
import { SearchController } from './controllers/search.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SemanticSearchService],
  controllers: [SearchController],
  exports: [SemanticSearchService],
})
export class SearchModule {}

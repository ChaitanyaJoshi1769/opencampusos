import { Module } from '@nestjs/common';
import { CatalogVersionService } from './services/catalog-version.service';
import { CatalogVersionController } from './controllers/catalog-version.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CatalogVersionService],
  controllers: [CatalogVersionController],
  exports: [CatalogVersionService],
})
export class CatalogVersionModule {}

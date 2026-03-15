/**
 * @fileoverview Root application module.
 * Bootstraps all feature modules and registers global controllers.
 */
import { Module } from '@nestjs/common';
import { CatController } from './cat/cat.controller';
import { CatService } from './cat/cat.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CatController],
  providers: [CatService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}

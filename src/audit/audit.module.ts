/**
 * @fileoverview Audit module.
 */
import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuditController],
  providers: [AuditService, PrismaService],
})
export class AuditModule {}

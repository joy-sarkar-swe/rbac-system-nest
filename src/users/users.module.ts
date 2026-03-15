/**
 * @fileoverview Users module.
 */
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuditInterceptor } from 'src/audit/interceptor/audit.interceptor';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AuditInterceptor],
})
export class UsersModule {}

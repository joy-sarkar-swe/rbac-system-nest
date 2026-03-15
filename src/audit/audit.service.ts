/**
 * @fileoverview Audit service.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { tryCatch } from 'src/common/utils/try-catch.util';
import { ServicePayload } from 'src/shared/interfaces/response.interface';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Reason: Retrieves paginated or complete audit logs.
   * Performance: Should be heavily indexed on action, userId, createdAt.
   */
  async findAll(): Promise<ServicePayload<any[]>> {
    return tryCatch(async () => {
      const logs = await this.prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100, // Limiting output to prevent huge payloads out of the box
      });
      return { message: 'Audit logs retrieved', data: logs };
    }, 'Failed to retrieve audit logs');
  }
}

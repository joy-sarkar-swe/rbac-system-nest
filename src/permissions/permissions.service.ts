/**
 * @fileoverview Permissions service.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { tryCatch } from 'src/common/utils/try-catch.util';
import { ServicePayload } from 'src/shared/interfaces/response.interface';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Reason: Returns all system permissions.
   */
  async findAll(): Promise<ServicePayload<any[]>> {
    return tryCatch(async () => {
      const perms = await this.prisma.permission.findMany();
      return { message: 'Permissions retrieved', data: perms };
    }, 'Failed to retrieve permissions');
  }

  /**
   * Reason: Returns the logged-in user's personal permissions.
   */
  async findMine(userId: string): Promise<ServicePayload<any[]>> {
    return tryCatch(async () => {
      const userPerms = await this.prisma.userPermission.findMany({
        where: { userId },
        include: { permission: true },
      });
      return {
        message: 'My permissions retrieved',
        data: userPerms.map((up) => up.permission),
      };
    }, 'Failed to retrieve my permissions');
  }
}

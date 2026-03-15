/**
 * @fileoverview Permission Guard.
 *
 * Evaluates route-level permissions against the authenticated user's permissions.
 */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  /**
   * Reason: Checks if the logged-in user possesses the specific permission atom required.
   * Performance: Uses a single optimized Prisma query with nested relation checking.
   * Security: Denies access if the user lacks the explicit atom.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAtom = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permission atom is required, grant access (handled by JwtAuthGuard alone).
    if (!requiredAtom) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('User context missing');
    }

    // Resolving permission via optimized query checking UserPermissions directly
    const hasPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId: user.id,
        permission: {
          atom: requiredAtom,
        },
      },
      select: { id: true }, // Select minimal data for performance
    });

    if (!hasPermission) {
      throw new ForbiddenException(`Missing required permission: ${requiredAtom}`);
    }

    return true;
  }
}

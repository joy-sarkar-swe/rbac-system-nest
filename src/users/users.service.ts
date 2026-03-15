/**
 * @fileoverview Users service.
 */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { tryCatch } from 'src/common/utils/try-catch.util';
import { ServicePayload } from 'src/shared/interfaces/response.interface';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Reason: Retrieves list of users.
   */
  async findAll(): Promise<ServicePayload<any[]>> {
    return tryCatch(async () => {
      const users = await this.prisma.user.findMany({ select: { id: true, email: true, name: true } });
      return { message: 'Users retrieved', data: users };
    }, 'Failed to retrieve users');
  }

  /**
   * Reason: Retrieves a specific user.
   */
  async findOne(id: string): Promise<ServicePayload<any>> {
    return tryCatch(async () => {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, name: true },
      });
      if (!user) throw new NotFoundException('User not found');
      return { message: 'User retrieved', data: user };
    }, 'Failed to retrieve user');
  }

  /**
   * Reason: Creates a new user with a hashed password and default role.
   * Security: Uses bcrypt to hash password before storage.
   */
  async create(dto: CreateUserDto): Promise<ServicePayload<any>> {
    return tryCatch(async () => {
      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      // Fetch default role for new users
      let role = await this.prisma.role.findUnique({ where: { name: 'Customer' } });
      if (!role) {
        role = await this.prisma.role.create({ data: { name: 'Customer' } });
      }

      const user = await this.prisma.user.create({
        data: { 
          email: dto.email, 
          name: dto.name, 
          password: hashedPassword, 
          roleId: role.id 
        },
      });
      return { message: 'User created', data: { id: user.id } };
    }, 'Failed to create user');
  }

  /**
   * Reason: Updates user profile data.
   */
  async update(id: string, dto: UpdateUserDto): Promise<ServicePayload<any>> {
    return tryCatch(async () => {
      const user = await this.prisma.user.update({
        where: { id },
        data: { email: dto.email, name: dto.name },
      });
      return { message: 'User updated', data: { id: user.id } };
    }, 'Failed to update user');
  }

  /**
   * Reason: Suspends user account.
   */
  async suspend(id: string): Promise<ServicePayload<any>> {
    return tryCatch(async () => {
      await this.prisma.user.update({
        where: { id },
        data: { isSuspended: true },
      });
      return { message: 'User suspended', data: { id } };
    }, 'Failed to suspend user');
  }

  /**
   * Reason: Bans user account.
   */
  async ban(id: string): Promise<ServicePayload<any>> {
    return tryCatch(async () => {
      await this.prisma.user.update({
        where: { id },
        data: { isBanned: true },
      });
      return { message: 'User banned', data: { id } };
    }, 'Failed to ban user');
  }

  /**
   * Reason: Updates user permissions enforcing a grant ceiling.
   * Security: A user cannot grant permissions they do not possess themselves (grant ceiling).
   */
  async updatePermissions(
    targetUserId: string,
    dto: UpdatePermissionsDto,
    actingUserId: string,
  ): Promise<ServicePayload<any>> {
    return tryCatch(async () => {
      // 1. Resolve atoms to actual DB permissions
      const requestedPermissions = await this.prisma.permission.findMany({
        where: { atom: { in: dto.permissions } },
      });

      if (requestedPermissions.length !== dto.permissions.length) {
        throw new NotFoundException('One or more permission atoms are invalid');
      }

      // 2. Check grant ceiling: retrieve acting user's permissions
      const actingUserPerms = await this.prisma.userPermission.findMany({
        where: { userId: actingUserId },
        include: { permission: true },
      });

      const actingUserAtoms = new Set(actingUserPerms.map((up) => up.permission.atom));

      // 3. Ensure acting user possesses all requested permissions
      for (const atom of dto.permissions) {
        if (!actingUserAtoms.has(atom)) {
          throw new ForbiddenException(`Grant ceiling violation: You cannot grant '${atom}' as you do not possess it.`);
        }
      }

      // 4. Update permissions in a transaction
      await this.prisma.$transaction(async (tx) => {
        // Clear existing permissions
        await tx.userPermission.deleteMany({ where: { userId: targetUserId } });

        // Insert new ones
        if (requestedPermissions.length > 0) {
          await tx.userPermission.createMany({
            data: requestedPermissions.map((p) => ({
              userId: targetUserId,
              permissionId: p.id,
              grantedBy: actingUserId,
            })),
          });
        }
      });

      return { message: 'Permissions updated successfully', data: null };
    }, 'Failed to update permissions');
  }
}

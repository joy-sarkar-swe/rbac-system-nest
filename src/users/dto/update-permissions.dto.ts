/**
 * @fileoverview Update Permissions DTO.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UpdatePermissionsDto {
  /**
   * Reason: Accepts an array of permission atoms to assign to the user.
   * Security: Validation ensures it's strictly an array of strings. The service layer handles grant ceilings.
   */
  @ApiProperty({ example: ['users.read', 'audit.read'] })
  @IsArray({ message: 'Permissions must be an array' })
  @IsString({ each: true, message: 'Each permission must be a string (atom)' })
  permissions!: string[];
}

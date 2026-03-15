/**
 * @fileoverview Permissions-specific error DTOs.
 */
import { ApiProperty } from '@nestjs/swagger';
import { CustomUnauthorizedDto } from 'src/common/dto/custom-unauthorized.dto';
import { CustomForbiddenDto } from 'src/common/dto/custom-forbidden.dto';
import { CustomInternalServerErrorDto } from 'src/common/dto/custom-internal-server-error.dto';
import { Methods } from 'src/common/enum/methods.enum';

export class PermissionUnauthorizedResponseDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: 'Authentication required' })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/permissions' })
  declare endpoint: string;
}

export class PermissionForbiddenResponseDto extends CustomForbiddenDto {
  @ApiProperty({ example: 'You do not have permission to view system permissions' })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/permissions' })
  declare endpoint: string;
}

export class PermissionInternalErrorResponseDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: 'Unexpected error during permission operation' })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/permissions' })
  declare endpoint: string;
}

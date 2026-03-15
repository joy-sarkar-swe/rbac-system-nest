/**
 * @fileoverview Audit-specific error DTOs.
 */
import { ApiProperty } from '@nestjs/swagger';
import { CustomUnauthorizedDto } from 'src/common/dto/custom-unauthorized.dto';
import { CustomForbiddenDto } from 'src/common/dto/custom-forbidden.dto';
import { CustomInternalServerErrorDto } from 'src/common/dto/custom-internal-server-error.dto';
import { Methods } from 'src/common/enum/methods.enum';

export class AuditUnauthorizedResponseDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: 'Authentication required' })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/audit-logs' })
  declare endpoint: string;
}

export class AuditForbiddenResponseDto extends CustomForbiddenDto {
  @ApiProperty({ example: 'Access denied: audit.read permission required' })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/audit-logs' })
  declare endpoint: string;
}

export class AuditInternalErrorResponseDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: 'Unexpected error during audit operation' })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/audit-logs' })
  declare endpoint: string;
}

/**
 * @fileoverview Get Audit Log Success DTO.
 */
import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { Methods } from 'src/common/enum/methods.enum';
import { AuditLogResponseDto } from './audit-log-response.dto';

export class GetAuditLogsSuccessResponseDto extends SuccessResponseDto<AuditLogResponseDto[]> {
  @ApiProperty({ example: 'Audit logs retrieved successfully' })
  declare message: string;

  @ApiProperty({ example: Methods.GET, enum: Methods })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/audit-logs' })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ type: [AuditLogResponseDto] })
  declare data: AuditLogResponseDto[];
}

/**
 * @fileoverview Audit Log DTO for responses.
 */
import { ApiProperty } from '@nestjs/swagger';

export class AuditLogResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  action!: string;

  @ApiProperty({ required: false })
  targetId?: string;

  @ApiProperty({ required: false })
  details?: any;

  @ApiProperty({ required: false })
  ip?: string;

  @ApiProperty()
  createdAt!: Date;
}

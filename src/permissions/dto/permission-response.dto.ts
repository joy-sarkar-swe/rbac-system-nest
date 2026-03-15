/**
 * @fileoverview Permission DTO for responses.
 */
import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  atom!: string;

  @ApiProperty({ required: false })
  description?: string;
}

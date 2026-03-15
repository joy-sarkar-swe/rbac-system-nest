/**
 * @fileoverview Get Permission Success DTO.
 */
import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PermissionResponseDto } from './permission-response.dto';
import { Methods } from 'src/common/enum/methods.enum';

export class GetPermissionsSuccessResponseDto extends SuccessResponseDto<PermissionResponseDto[]> {
  @ApiProperty({ example: 'Permissions retrieved successfully' })
  declare message: string;

  @ApiProperty({ example: Methods.GET, enum: Methods })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/permissions' })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ type: [PermissionResponseDto] })
  declare data: PermissionResponseDto[];
}

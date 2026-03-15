/**
 * @fileoverview Get User Success DTO.
 */
import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { UserResponseDto } from './user-response.dto';
import { Methods } from 'src/common/enum/methods.enum';

export class GetUserSuccessResponseDto extends SuccessResponseDto<UserResponseDto> {
  @ApiProperty({ example: 'User retrieved successfully' })
  declare message: string;

  @ApiProperty({ example: Methods.GET, enum: Methods })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/users/:id' })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ type: UserResponseDto })
  declare data: UserResponseDto;
}

export class GetUsersSuccessResponseDto extends SuccessResponseDto<UserResponseDto[]> {
  @ApiProperty({ example: 'Users retrieved successfully' })
  declare message: string;

  @ApiProperty({ example: Methods.GET, enum: Methods })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/users' })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ type: [UserResponseDto] })
  declare data: UserResponseDto[];
}

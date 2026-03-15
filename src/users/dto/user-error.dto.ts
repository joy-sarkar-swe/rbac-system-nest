/**
 * @fileoverview Users-specific error DTOs.
 */
import { ApiProperty } from '@nestjs/swagger';
import { CustomUnauthorizedDto } from 'src/common/dto/custom-unauthorized.dto';
import { CustomForbiddenDto } from 'src/common/dto/custom-forbidden.dto';
import { CustomNotFoundDto } from 'src/common/dto/custom-not-found.dto';
import { CustomConflictDto } from 'src/common/dto/custom-conflict.dto';
import { ValidationErrorResponseDto } from 'src/common/dto/validation-error.dto';
import { CustomInternalServerErrorDto } from 'src/common/dto/custom-internal-server-error.dto';
import { Methods } from 'src/common/enum/methods.enum';

export class UserUnauthorizedResponseDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: 'Token is invalid or expired' })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/users' })
  declare endpoint: string;
}

export class UserForbiddenResponseDto extends CustomForbiddenDto {
  @ApiProperty({ example: 'Missing required permission atom' })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/users' })
  declare endpoint: string;
}

export class UserNotFoundResponseDto extends CustomNotFoundDto {
  @ApiProperty({ example: 'User with provided ID not found' })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/users/:id' })
  declare endpoint: string;
}

export class UserConflictResponseDto extends CustomConflictDto {
  @ApiProperty({ example: 'User with this email already exists' })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: '/api/users' })
  declare endpoint: string;
}

export class UserValidationErrorResponseDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: 'User data validation failed' })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: '/api/users' })
  declare endpoint: string;
}

export class UserInternalErrorResponseDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: 'Unexpected error during user operation' })
  declare message: string;

  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: '/api/users' })
  declare endpoint: string;
}

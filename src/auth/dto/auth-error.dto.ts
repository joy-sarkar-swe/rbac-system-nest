/**
 * @fileoverview Auth-specific error DTOs.
 */
import { ApiProperty } from '@nestjs/swagger';
import { CustomUnauthorizedDto } from 'src/common/dto/custom-unauthorized.dto';
import { ValidationErrorResponseDto } from 'src/common/dto/validation-error.dto';
import { CustomTooManyRequestsDto } from 'src/common/dto/custom-throttler.dto';
import { CustomInternalServerErrorDto } from 'src/common/dto/custom-internal-server-error.dto';
import { Methods } from 'src/common/enum/methods.enum';

export class AuthUnauthorizedResponseDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: 'Invalid credentials provided' })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: '/api/auth/login' })
  declare endpoint: string;

  @ApiProperty({ example: 'Unauthorized' })
  declare error: string;
}

export class AuthValidationErrorResponseDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: 'Login validation failed' })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: '/api/auth/login' })
  declare endpoint: string;
}

export class AuthThrottlerErrorResponseDto extends CustomTooManyRequestsDto {
  @ApiProperty({ example: 'Brute-force protection: too many login attempts' })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: '/api/auth/login' })
  declare endpoint: string;
}

export class AuthInternalErrorResponseDto extends CustomInternalServerErrorDto {
  @ApiProperty({ example: 'Unexpected error during authentication' })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: '/api/auth/login' })
  declare endpoint: string;
}

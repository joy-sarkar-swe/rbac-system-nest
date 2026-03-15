/**
 * @fileoverview Login Success DTO.
 */
import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { Methods } from 'src/common/enum/methods.enum';

export class LoginDataDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...' })
  accessToken!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...' })
  refreshToken!: string;
}

export class LoginSuccessResponseDto extends SuccessResponseDto<LoginDataDto> {
  @ApiProperty({ example: 'Login successful' })
  declare message: string;

  @ApiProperty({ example: Methods.POST, enum: Methods })
  declare method: Methods.POST;

  @ApiProperty({ example: '/api/auth/login' })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ type: LoginDataDto })
  declare data: LoginDataDto;
}

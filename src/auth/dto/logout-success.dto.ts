import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { Methods } from 'src/common/enum/methods.enum';
import { LoginDataDto } from './login-success.dto';

export class LogoutSuccessResponseDto extends SuccessResponseDto<LoginDataDto> {
  @ApiProperty({ example: 'Logout successful' })
  declare message: string;

  @ApiProperty({ example: Methods.POST, enum: Methods })
  declare method: Methods.POST;

  @ApiProperty({ example: '/api/auth/logout' })
  declare endpoint: string;

  @ApiProperty({ example: 200 })
  declare statusCode: number;
}

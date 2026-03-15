import { ApiProperty } from '@nestjs/swagger';
import { CustomUnauthorizedDto } from 'src/common/dto/custom-unauthorized.dto';
import { Methods } from 'src/common/enum/methods.enum';

export class AuthLogoutUnauthorizedResponseDto extends CustomUnauthorizedDto {
  @ApiProperty({ example: 'Invalid credentials provided' })
  declare message: string;

  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: '/api/auth/logout' })
  declare endpoint: string;

  @ApiProperty({ example: 'Unauthorized' })
  declare error: string;
}

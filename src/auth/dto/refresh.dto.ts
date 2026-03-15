/**
 * @fileoverview Refresh Token DTO.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  /**
   * Reason: Refresh token is required to generate a new access token.
   * Security: Passed in body or via HTTP-only cookie depending on client. We validate its presence here.
   */
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...' })
  @IsString({ message: 'Refresh token must be a string' })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken!: string;
}

/**
 * @fileoverview Login DTO.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  /**
   * Reason: Email is the primary identifier for users.
   * Security: Validated as a proper email format to prevent injection or malformed data.
   */
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  /**
   * Reason: Password required for authentication.
   * Security: Minimum length enforced. Will be compared against hashed password in DB.
   */
  @ApiProperty({ example: 'Password123!' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;
}

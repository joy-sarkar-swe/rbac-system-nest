/**
 * @fileoverview DTO for 429 Too Many Requests responses, used in Swagger documentation.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Methods } from '../enum/methods.enum';

/** Swagger schema for 429 Too Many Requests responses. */
export class CustomTooManyRequestsDto {
  @ApiProperty({ example: false })
  success!: boolean;

  @ApiProperty({ example: 'Too many requests' })
  message!: string;

  @ApiProperty({ example: Methods.POST })
  method!: Methods;

  @ApiProperty({ example: '/' })
  endpoint!: string;

  @ApiProperty({ example: 429 })
  statusCode!: number;

  @ApiProperty({ example: '2026-02-23T12:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: 'Too many requests error details' })
  error!: string;
}

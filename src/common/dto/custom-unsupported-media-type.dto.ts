/**
 * @fileoverview DTO for 415 Unsupported Media Type responses, used in Swagger documentation.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Methods } from '../enum/methods.enum';

/** Swagger schema for 415 Unsupported Media Type responses. */
export class CustomUnsupportedMediaTypeDto {
  @ApiProperty({ example: false })
  success!: boolean;

  @ApiProperty({ example: 'Unsupported Media Type' })
  message!: string;

  @ApiProperty({ example: Methods.POST })
  method!: Methods;

  @ApiProperty({ example: '/' })
  endpoint!: string;

  @ApiProperty({ example: 415 })
  statusCode!: number;

  @ApiProperty({ example: '2026-02-22T12:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: 'Unsupported Media Type error details' })
  error!: string;
}

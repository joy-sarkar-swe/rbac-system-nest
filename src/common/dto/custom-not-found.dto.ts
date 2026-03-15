/**
 * @fileoverview DTO for 404 Not Found responses, used in Swagger documentation.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Methods } from '../enum/methods.enum';

/** Swagger schema for 404 Not Found responses. */
export class CustomNotFoundDto {
  @ApiProperty({ example: false })
  success!: boolean;

  @ApiProperty({ example: 'Not found error' })
  message!: string;

  @ApiProperty({ example: Methods.POST })
  method!: Methods;

  @ApiProperty({ example: '/' })
  endpoint!: string;

  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({ example: '2026-02-22T12:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: 'Not found error details' })
  error!: string;
}

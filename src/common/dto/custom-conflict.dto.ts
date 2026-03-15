/**
 * @fileoverview DTO for 409 Conflict responses, used in Swagger documentation.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Methods } from '../enum/methods.enum';

/** Swagger schema for 409 Conflict responses. */
export class CustomConflictDto {
  @ApiProperty({ example: false })
  success!: boolean;

  @ApiProperty({ example: 'Conflict error' })
  message!: string;

  @ApiProperty({ example: Methods.POST })
  method!: Methods;

  @ApiProperty({ example: '/' })
  endpoint!: string;

  @ApiProperty({ example: 409 })
  statusCode!: number;

  @ApiProperty({ example: '2026-02-22T12:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: 'Conflict error details' })
  error!: string;
}

/**
 * @fileoverview Swagger DTOs for 400 Validation Error responses.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Methods } from '../enum/methods.enum';

/** Represents a single field-level validation failure. */
export class FieldErrorDto {
  @ApiProperty({ example: 'name' })
  field!: string;

  @ApiProperty({ example: 'name must be a string' })
  message!: string;
}

/** Swagger schema for a 400 Bad Request validation error response. */
export class ValidationErrorResponseDto {
  @ApiProperty({ example: false })
  success!: boolean;

  @ApiProperty({ example: 'Validation failed' })
  message!: string;

  @ApiProperty({ example: Methods.POST })
  method!: Methods;

  @ApiProperty({ example: '/' })
  endpoint!: string;

  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: '2026-02-22T10:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ type: [FieldErrorDto] })
  errors!: FieldErrorDto[];
}

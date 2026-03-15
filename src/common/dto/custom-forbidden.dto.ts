/**
 * @fileoverview DTO for 403 Forbidden responses, used in Swagger documentation.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Methods } from '../enum/methods.enum';

/** Swagger schema for 403 Forbidden responses. */
export class CustomForbiddenDto {
  @ApiProperty({ example: false })
  success!: boolean;

  @ApiProperty({ example: 'Forbidden access' })
  message!: string;

  @ApiProperty({ example: Methods.POST })
  method!: Methods;

  @ApiProperty({ example: '/' })
  endpoint!: string;

  @ApiProperty({ example: 403 })
  statusCode!: number;

  @ApiProperty({ example: '2026-02-22T12:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: 'Forbidden access details' })
  error!: string;
}

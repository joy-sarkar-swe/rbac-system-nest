/**
 * @fileoverview `ApiErrorResponses` — composite Swagger decorator for error responses.
 * Apply it on a controller method to document all relevant error status codes in one call.
 */
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiPayloadTooLargeResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { CustomConflictDto } from '../dto/custom-conflict.dto';
import { CustomForbiddenDto } from '../dto/custom-forbidden.dto';
import { CustomInternalServerErrorDto } from '../dto/custom-internal-server-error.dto';
import { CustomNotFoundDto } from '../dto/custom-not-found.dto';
import { CustomUnauthorizedDto } from '../dto/custom-unauthorized.dto';
import { ValidationErrorResponseDto } from '../dto/validation-error.dto';
import { CustomUnsupportedMediaTypeDto } from '../dto/custom-unsupported-media-type.dto';

/** Map of optional error DTOs. Omit a key to skip that status code in Swagger docs. */
interface ErrorDtoMap {
  /** 400 Bad Request — validation errors. */
  validation?: any;
  /** 401 Unauthorized. */
  unauthorized?: any;
  /** 403 Forbidden. */
  forbidden?: any;
  /** 404 Not Found. */
  notFound?: any;
  /** 409 Conflict. */
  conflict?: any;
  /** 413 Payload Too Large. */
  payloadTooLarge?: any;
  /** 415 Unsupported Media Type. */
  unsupported?: any;
  /** 500 Internal Server Error. */
  internal?: any;
  /** 429 Too Many Requests. */
  throttle?: any;
}

/**
 * Composite decorator that registers multiple Swagger error-response schemas at once.
 *
 * @param dtos - Map of error types to their Swagger DTO classes.
 *
 * @example
 * ```ts
 * @ApiErrorResponses({ validation: MyValidationDto, internal: MyInternalDto })
 * ```
 */
export function ApiErrorResponses(dtos: ErrorDtoMap) {
  const decorators: (MethodDecorator & ClassDecorator)[] = [];

  if (dtos.validation)
    decorators.push(ApiBadRequestResponse({ type: dtos.validation || ValidationErrorResponseDto }));
  if (dtos.unauthorized)
    decorators.push(ApiUnauthorizedResponse({ type: dtos.unauthorized || CustomUnauthorizedDto }));
  if (dtos.forbidden)
    decorators.push(ApiForbiddenResponse({ type: dtos.forbidden || CustomForbiddenDto }));
  if (dtos.notFound)
    decorators.push(ApiNotFoundResponse({ type: dtos.notFound || CustomNotFoundDto }));
  if (dtos.conflict)
    decorators.push(ApiConflictResponse({ type: dtos.conflict || CustomConflictDto }));
  if (dtos.unsupported)
    decorators.push(ApiUnsupportedMediaTypeResponse({ type: dtos.unsupported || CustomUnsupportedMediaTypeDto }));
  if (dtos.internal)
    decorators.push(ApiInternalServerErrorResponse({ type: dtos.internal || CustomInternalServerErrorDto }));
  if (dtos.throttle)
    decorators.push(ApiTooManyRequestsResponse({ type: dtos.throttle }));

  return applyDecorators(...decorators);
}

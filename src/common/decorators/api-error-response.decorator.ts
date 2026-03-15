/**
 * @fileoverview `ApiErrorResponses` — composite Swagger decorator for error responses.
 */
import { applyDecorators, Type } from '@nestjs/common';
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
import { CustomTooManyRequestsDto } from '../dto/custom-throttler.dto';

/** Map of optional error DTOs. Omit a key to skip that status code in Swagger docs. */
interface ErrorDtoMap {
  /** 400 Bad Request — validation errors. */
  validation?: Type<unknown> | boolean;
  /** 401 Unauthorized. */
  unauthorized?: Type<unknown> | boolean;
  /** 403 Forbidden. */
  forbidden?: Type<unknown> | boolean;
  /** 404 Not Found. */
  notFound?: Type<unknown> | boolean;
  /** 409 Conflict. */
  conflict?: Type<unknown> | boolean;
  /** 413 Payload Too Large. */
  payloadTooLarge?: Type<unknown> | boolean;
  /** 415 Unsupported Media Type. */
  unsupported?: Type<unknown> | boolean;
  /** 500 Internal Server Error. */
  internal?: Type<unknown> | boolean;
  /** 429 Too Many Requests. */
  throttle?: Type<unknown> | boolean;
}

/**
 * Composite decorator that registers multiple Swagger error-response schemas at once.
 */
export function ApiErrorResponses(dtos: ErrorDtoMap) {
  const decorators: (MethodDecorator & ClassDecorator)[] = [];

  const addError = (
    dto: Type<unknown> | boolean | undefined,
    defaultDto: Type<unknown>,
    decorator: any,
  ) => {
    if (dto) {
      const actualDto = typeof dto === 'function' ? dto : defaultDto;
      decorators.push(decorator({ type: actualDto }));
    }
  };

  addError(dtos.validation, ValidationErrorResponseDto, ApiBadRequestResponse);
  addError(dtos.unauthorized, CustomUnauthorizedDto, ApiUnauthorizedResponse);
  addError(dtos.forbidden, CustomForbiddenDto, ApiForbiddenResponse);
  addError(dtos.notFound, CustomNotFoundDto, ApiNotFoundResponse);
  addError(dtos.conflict, CustomConflictDto, ApiConflictResponse);
  addError(dtos.unsupported, CustomUnsupportedMediaTypeDto, ApiUnsupportedMediaTypeResponse);
  addError(dtos.internal, CustomInternalServerErrorDto, ApiInternalServerErrorResponse);
  addError(dtos.throttle, CustomTooManyRequestsDto, ApiTooManyRequestsResponse);
  addError(dtos.payloadTooLarge, CustomInternalServerErrorDto, ApiPayloadTooLargeResponse);

  return applyDecorators(...decorators);
}

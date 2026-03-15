/**
 * @fileoverview `ApiSuccessResponse` — composite Swagger decorator for 2xx success responses.
 */
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * Documents a successful API response in Swagger using the provided DTO model.
 *
 * @param model - DTO class decorated with Swagger decorators.
 * @param status - HTTP status code (default: 200).
 * @param isArray - Set to `true` when the response data is an array.
 *
 * @example
 * ```ts
 * @ApiSuccessResponse(GetUserResponseDto, 200)
 * @ApiSuccessResponse(GetUsersResponseDto, 200, true)
 * ```
 */
export function ApiSuccessResponse<TModel extends Type<any>>(
  model: TModel,
  status = HttpStatus.OK,
  isArray = false,
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      schema: isArray 
        ? { type: 'array', items: { $ref: getSchemaPath(model) } }
        : { $ref: getSchemaPath(model) },
    }),
  );
}

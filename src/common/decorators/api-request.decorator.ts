/**
 * @fileoverview `ApiRequestDetails` — composite Swagger decorator for route parameters and query strings.
 */
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiParam,
  ApiParamOptions,
  ApiQuery,
  ApiQueryOptions,
} from '@nestjs/swagger';

type SingleOrArray<T> = T | T[];

/** Configuration for the `ApiRequestDetails` decorator. */
interface SwaggerRequestConfig {
  /** Route parameter(s) to document. */
  params?: SingleOrArray<ApiParamOptions>;
  /** Query parameter(s) to document. */
  queries?: SingleOrArray<ApiQueryOptions>;
  /** DTO class for query params (registered as an extra model). */
  queryDto?: Type<unknown>;
  /** DTO class for route params (registered as an extra model). */
  paramDto?: Type<unknown>;
}

/**
 * Composite decorator to document route params and query strings in a single call.
 *
 * @param config - Params, queries, and optional DTO models to register.
 *
 * @example
 * ```ts
 * @ApiRequestDetails({ params: [{ name: 'id', required: true }], queries: { name: 'search' } })
 * ```
 */
export function ApiRequestDetails(config: SwaggerRequestConfig): MethodDecorator {
  const decorators: MethodDecorator[] = [];

  if (config?.params) {
    const paramArray = Array.isArray(config.params) ? config.params : [config.params];
    decorators.push(...paramArray.map((param) => ApiParam(param)));
  }

  if (config?.queries) {
    const queryArray = Array.isArray(config.queries) ? config.queries : [config.queries];
    decorators.push(...queryArray.map((query) => ApiQuery(query)));
  }

  if (config?.queryDto) decorators.push(ApiExtraModels(config.queryDto));
  if (config?.paramDto) decorators.push(ApiExtraModels(config.paramDto));

  return applyDecorators(...decorators);
}

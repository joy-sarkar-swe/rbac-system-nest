/**
 * @fileoverview Global response interceptor for the API Gateway.
 * Wraps all outgoing responses in a standardised ServiceResponse envelope.
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceResponse } from 'src/shared/interfaces/response.interface';

/**
 * Wraps all outgoing responses in a standardised {@link ServiceResponse} envelope.
 * Already-wrapped responses are returned as-is.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  /**
   * Intercept outgoing responses and map them into ServiceResponse format.
   *
   * @param context Execution context providing request/response objects
   * @param next CallHandler for the next action in the request pipeline
   * @returns Observable<ServiceResponse> - formatted response
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const httpRes = context.switchToHttp().getResponse();

    const method = req?.method;
    const url: string = req?.originalUrl || req?.url || '';

    // Skip response wrapping for the root API path
    if (url === '/api' || url === '/api/') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // If response is already a ServiceResponse, return as-is
        if (data?.success !== undefined && data?.timestamp) {
          if (typeof data.statusCode !== 'number') {
            const currentStatus = httpRes?.statusCode ?? 200;
            return { ...data, statusCode: currentStatus };
          }
          return data;
        }

        // Determine the appropriate status code for the response
        const statusCode =
          typeof data?.statusCode === 'number'
            ? data.statusCode
            : (httpRes?.statusCode ?? 200);
        if (httpRes?.statusCode !== statusCode) {
          httpRes?.status(statusCode);
        }

        // Check if the original data is already an envelope with message and data properties
        const isEnvelope =
          data &&
          typeof data === 'object' &&
          (Object.prototype.hasOwnProperty.call(data, 'message') ||
            Object.prototype.hasOwnProperty.call(data, 'data'));
        const responseMessage =
          isEnvelope && Object.prototype.hasOwnProperty.call(data, 'message')
            ? data.message
            : 'Request successful';
        const responseData =
          isEnvelope && Object.prototype.hasOwnProperty.call(data, 'data')
            ? data.data
            : data;

        // Construct the standardized service response
        const response: ServiceResponse = {
          success: statusCode >= 200 && statusCode < 300,
          message: responseMessage,
          method,
          endpoint: url,
          statusCode,
          timestamp: new Date().toISOString(),
          data: responseData, // wrap actual payload
        };

        return response;
      }),
    );
  }
}

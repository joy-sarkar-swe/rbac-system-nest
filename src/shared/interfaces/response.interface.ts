/**
 * @fileoverview Standard API response envelope.
 *
 * Every response emitted by the API Gateway is wrapped in this
 * shape by the global {@link ResponseInterceptor} so that clients
 * always receive a predictable JSON structure.
 */

/**
 * Envelope returned by service methods to carry a custom message alongside the payload.
 * The global ResponseInterceptor unwraps this into the standard ServiceResponse shape.
 */
export interface ServicePayload<T = any> {
  message: string;
  data: T;
}

export interface ServiceResponse<T = any> {
  /** Whether the request completed without error. */
  success: boolean;

  /** Human-readable summary of the outcome. */
  message: string;

  /** HTTP method that triggered the response (e.g. `GET`). */
  method?: string;

  /** Request path (e.g. `/api/user/123`). */
  endpoint?: string;

  /** ISO-8601 timestamp of when the response was produced. */
  timestamp: string;

  /** HTTP status code. */
  statusCode: number;

  /** Payload returned on success. */
  data?: T;

  /** Single error string on failure. */
  error?: string;

  /** Field-level validation errors on failure. */
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

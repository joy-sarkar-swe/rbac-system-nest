/**
 * @fileoverview tryCatch utility function.
 *
 * Provides a standardized way to execute async operations with error handling.
 * Catches any errors thrown by the provided async function and re-throws them
 * as InternalServerErrorExceptions with a custom message, unless the error is
 * already an InternalServerErrorException, in which case it is re-thrown as-is.
 */
import { InternalServerErrorException } from '@nestjs/common';

/**
 * Executes an async operation and re-throws any error as an
 * {@link InternalServerErrorException} with the provided message.
 * Already-thrown `InternalServerErrorException` instances are
 * re-thrown as-is to preserve originating error messages.
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  message: string,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof InternalServerErrorException) throw error;
    throw new InternalServerErrorException(message);
  }
}

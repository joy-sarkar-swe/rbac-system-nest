/**
 * @fileoverview Audit Interceptor.
 *
 * Provides append-only logging for sensitive or protected routes.
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Reason: Automatically logs request details (method, endpoint, user) asynchronously to not block the response.
   * Performance: Executes the Prisma write asynchronously (fire-and-forget) after the route handler completes.
   * Security: Append-only log to track sensitive operations for compliance.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const endpoint = request.originalUrl || request.url;
    const userId = request.user?.id || 'anonymous';
    const ipAddress = request.ip || request.connection?.remoteAddress || 'unknown';

    // Only audit modifying requests if needed, or all protected requests as requested
    return next.handle().pipe(
      tap(() => {
        // Fire-and-forget audit log creation
        this.prisma.auditLog
          .create({
            data: {
              userId,
              action: method,
              targetId: endpoint,
              ip: ipAddress,
              details: { body: request.body, query: request.query },
            },
          })
          .catch((err) => {
            // Log to internal logger but don't fail the request
            console.error('AuditLog creation failed:', err);
          });
      }),
    );
  }
}

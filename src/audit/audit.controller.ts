/**
 * @fileoverview Audit controller.
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator';
import { Permission } from 'src/common/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { ServicePayload } from 'src/shared/interfaces/response.interface';
import { AuditService } from './audit.service';
import {
  AuditForbiddenResponseDto,
  AuditInternalErrorResponseDto,
  AuditUnauthorizedResponseDto,
} from './dto/audit-error.dto';
import { GetAuditLogsSuccessResponseDto } from './dto/get-audit-log-success.dto';

@ApiTags('Audit')
@ApiBearerAuth('Authorization')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
  required: true,
})
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @ApiOperation({ summary: 'Get audit logs' })
  @ApiSuccessResponse(GetAuditLogsSuccessResponseDto)
  @ApiErrorResponses({
    unauthorized: AuditUnauthorizedResponseDto,
    forbidden: AuditForbiddenResponseDto,
    internal: AuditInternalErrorResponseDto,
  })
  @Permission('audit.read')
  @Get()
  async findAll(): Promise<ServicePayload> {
    return this.auditService.findAll();
  }
}

/**
 * @fileoverview Permissions controller.
 */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
import { GetPermissionsSuccessResponseDto } from './dto/get-permission-success.dto';
import {
  PermissionForbiddenResponseDto,
  PermissionInternalErrorResponseDto,
  PermissionUnauthorizedResponseDto,
} from './dto/permission-error.dto';
import { PermissionsService } from './permissions.service';

@ApiTags('Permissions')
@ApiBearerAuth('Authorization')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
  required: true,
})
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOperation({ summary: 'Get all system permissions' })
  @ApiSuccessResponse(GetPermissionsSuccessResponseDto)
  @ApiErrorResponses({
    unauthorized: PermissionUnauthorizedResponseDto,
    forbidden: PermissionForbiddenResponseDto,
    internal: PermissionInternalErrorResponseDto,
  })
  @Permission('settings.manage')
  @Get('permissions')
  async findAll(): Promise<ServicePayload> {
    return this.permissionsService.findAll();
  }

  @ApiOperation({ summary: 'Get my permissions' })
  @ApiSuccessResponse(GetPermissionsSuccessResponseDto)
  @ApiErrorResponses({
    unauthorized: PermissionUnauthorizedResponseDto,
    internal: PermissionInternalErrorResponseDto,
  })
  @Get('me/permissions')
  async findMine(@Req() req: any): Promise<ServicePayload> {
    return this.permissionsService.findMine(req.user.id);
  }
}

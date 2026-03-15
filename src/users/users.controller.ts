/**
 * @fileoverview Users controller.
 */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit/interceptor/audit.interceptor';
import { ApiErrorResponses } from 'src/common/decorators/api-error-response.decorator';
import { ApiRequestDetails } from 'src/common/decorators/api-request.decorator';
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator';
import { Permission } from 'src/common/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { ServicePayload } from 'src/shared/interfaces/response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import {
  GetUserSuccessResponseDto,
  GetUsersSuccessResponseDto,
} from './dto/get-user-success.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserConflictResponseDto,
  UserForbiddenResponseDto,
  UserInternalErrorResponseDto,
  UserNotFoundResponseDto,
  UserUnauthorizedResponseDto,
  UserValidationErrorResponseDto,
} from './dto/user-error.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('Authorization')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
  required: true,
})
@UseGuards(JwtAuthGuard, PermissionGuard)
@UseInterceptors(AuditInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiSuccessResponse(GetUsersSuccessResponseDto)
  @ApiErrorResponses({
    unauthorized: UserUnauthorizedResponseDto,
    forbidden: UserForbiddenResponseDto,
    internal: UserInternalErrorResponseDto,
  })
  @Permission('users.read')
  @Get()
  async findAll(): Promise<ServicePayload> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiSuccessResponse(GetUserSuccessResponseDto, 201)
  @ApiErrorResponses({
    validation: UserValidationErrorResponseDto,
    unauthorized: UserUnauthorizedResponseDto,
    forbidden: UserForbiddenResponseDto,
    conflict: UserConflictResponseDto,
    internal: UserInternalErrorResponseDto,
  })
  @Permission('users.write')
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<ServicePayload> {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Get specific user' })
  @ApiRequestDetails({ params: { name: 'id', description: 'User UUID' } })
  @ApiSuccessResponse(GetUserSuccessResponseDto)
  @ApiErrorResponses({
    unauthorized: UserUnauthorizedResponseDto,
    forbidden: UserForbiddenResponseDto,
    notFound: UserNotFoundResponseDto,
    internal: UserInternalErrorResponseDto,
  })
  @Permission('users.read')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServicePayload> {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiRequestDetails({ params: { name: 'id' } })
  @ApiSuccessResponse(GetUserSuccessResponseDto)
  @ApiErrorResponses({
    validation: UserValidationErrorResponseDto,
    unauthorized: UserUnauthorizedResponseDto,
    forbidden: UserForbiddenResponseDto,
    notFound: UserNotFoundResponseDto,
    internal: UserInternalErrorResponseDto,
  })
  @Permission('users.write')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ServicePayload> {
    return this.usersService.update(id, dto);
  }

  @ApiOperation({ summary: 'Suspend user' })
  @ApiRequestDetails({ params: { name: 'id' } })
  @ApiSuccessResponse(GetUserSuccessResponseDto)
  @ApiErrorResponses({
    unauthorized: UserUnauthorizedResponseDto,
    forbidden: UserForbiddenResponseDto,
    notFound: UserNotFoundResponseDto,
    internal: UserInternalErrorResponseDto,
  })
  @Permission('users.write')
  @Patch(':id/suspend')
  async suspend(@Param('id') id: string): Promise<ServicePayload> {
    return this.usersService.suspend(id);
  }

  @ApiOperation({ summary: 'Ban user' })
  @ApiRequestDetails({ params: { name: 'id' } })
  @ApiSuccessResponse(GetUserSuccessResponseDto)
  @ApiErrorResponses({
    unauthorized: UserUnauthorizedResponseDto,
    forbidden: UserForbiddenResponseDto,
    notFound: UserNotFoundResponseDto,
    internal: UserInternalErrorResponseDto,
  })
  @Permission('users.write')
  @Patch(':id/ban')
  async ban(@Param('id') id: string): Promise<ServicePayload> {
    return this.usersService.ban(id);
  }

  @ApiOperation({ summary: 'Update user permissions' })
  @ApiRequestDetails({ params: { name: 'id' } })
  @ApiSuccessResponse(GetUserSuccessResponseDto)
  @ApiErrorResponses({
    validation: UserValidationErrorResponseDto,
    unauthorized: UserUnauthorizedResponseDto,
    forbidden: UserForbiddenResponseDto,
    notFound: UserNotFoundResponseDto,
    internal: UserInternalErrorResponseDto,
  })
  @Permission('users.write')
  @Put(':id/permissions')
  async updatePermissions(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionsDto,
    @Req() req: any,
  ): Promise<ServicePayload> {
    return this.usersService.updatePermissions(id, dto, req.user.id);
  }
}

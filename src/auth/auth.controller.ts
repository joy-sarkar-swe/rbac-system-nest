/**
 * @fileoverview Auth controller.
 */
import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiErrorResponses } from 'src/common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ServicePayload } from 'src/shared/interfaces/response.interface';
import { AuthService } from './auth.service';
import {
  AuthInternalErrorResponseDto,
  AuthThrottlerErrorResponseDto,
  AuthUnauthorizedResponseDto,
  AuthValidationErrorResponseDto,
} from './dto/auth-error.dto';
import { LoginSuccessResponseDto } from './dto/login-success.dto';
import { LoginDto } from './dto/login.dto';
import { AuthLogoutUnauthorizedResponseDto } from './dto/logout-error.dto';
import { LogoutSuccessResponseDto } from './dto/logout-success.dto';
import { RefreshDto } from './dto/refresh.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Reason: Login endpoint for issuing tokens.
   * Security: Uses Passport local strategy and ThrottlerGuard.
   * Validation: LoginDto ensures proper input shape.
   */
  @ApiOperation({ summary: 'User login' })
  @ApiSuccessResponse(LoginSuccessResponseDto, 200)
  @ApiErrorResponses({
    validation: AuthValidationErrorResponseDto,
    unauthorized: AuthUnauthorizedResponseDto,
    throttle: AuthThrottlerErrorResponseDto,
    internal: AuthInternalErrorResponseDto,
  })
  @UseGuards(ThrottlerGuard, AuthGuard('local'))
  @Post('login')
  async login(
    @Req() req: any,
    @Body() _dto: LoginDto,
  ): Promise<ServicePayload> {
    // The dto is used by ValidationPipe and Passport Local Strategy extracts from it.
    // req.user is populated by LocalStrategy.validate after password compare.
    return this.authService.login(req.user);
  }

  /**
   * Reason: Refresh endpoint.
   */
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiSuccessResponse(LoginSuccessResponseDto, 200)
  @ApiErrorResponses({
    validation: AuthValidationErrorResponseDto,
    unauthorized: AuthUnauthorizedResponseDto,
    throttle: AuthThrottlerErrorResponseDto,
  })
  @UseGuards(ThrottlerGuard)
  @Post('refresh')
  async refresh(@Body() dto: RefreshDto): Promise<ServicePayload> {
    return this.authService.refresh(dto);
  }

  /**
   * Reason: Logout endpoint to invalidate token.
   */
  @ApiOperation({ summary: 'Logout' })
  @ApiBearerAuth('Authorization')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiSuccessResponse(LogoutSuccessResponseDto, 200)
  @ApiErrorResponses({ unauthorized: AuthLogoutUnauthorizedResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Headers('Authorization') authHeader?: string,
  ): Promise<ServicePayload> {
    const token = authHeader?.split(' ')[1] || '';
    return this.authService.logout(token);
  }
}

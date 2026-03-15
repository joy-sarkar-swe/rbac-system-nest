/**
 * @fileoverview Auth service.
 */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { tryCatch } from 'src/common/utils/try-catch.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicePayload } from 'src/shared/interfaces/response.interface';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Reason: Validates user credentials.
   * Security: Uses bcrypt to compare hashed passwords.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Reason: Issues access and refresh tokens.
   * Security: Tokens are signed with JWT.
   */
  async login(
    user: any,
  ): Promise<ServicePayload<{ accessToken: string; refreshToken: string }>> {
    return tryCatch(async () => {
      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      return {
        message: 'Login successful',
        data: { accessToken, refreshToken },
      };
    }, 'Failed to login');
  }

  /**
   * Reason: Refreshes access token using a valid refresh token.
   */
  async refresh(
    dto: RefreshDto,
  ): Promise<ServicePayload<{ accessToken: string }>> {
    return tryCatch(async () => {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken);
      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: '15m' },
      );

      return {
        message: 'Token refreshed successfully',
        data: { accessToken: newAccessToken },
      };
    }, 'Failed to refresh token');
  }

  /**
   * Reason: Logout by blacklisting the token.
   */
  async logout(token: string): Promise<ServicePayload<null>> {
    return tryCatch(async () => {
      await this.prisma.blacklistedToken.create({
        data: { token, expiresAt: new Date(Date.now() + 3600000) },
      });
      return {
        message: 'Logout successful',
        data: null,
      };
    }, 'Failed to logout');
  }
}

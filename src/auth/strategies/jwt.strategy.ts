/**
 * @fileoverview JWT Strategy for Passport.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey', // In production, use environment variable
    });
  }

  /**
   * Reason: Validates the JWT payload and ensures the user exists.
   * Security: Checks against DB for every request (can be optimized with caching).
   */
  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || user.isSuspended || user.isBanned) {
      throw new UnauthorizedException('User account inactive or not found');
    }
    return { id: user.id, email: user.email };
  }
}

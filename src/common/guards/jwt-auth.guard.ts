/**
 * @fileoverview JWT Authentication Guard.
 *
 * Uses Passport's JWT Strategy.
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

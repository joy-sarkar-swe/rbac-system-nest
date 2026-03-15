/**
 * @fileoverview Permission decorator.
 *
 * Attaches required permission atoms to the route handler.
 */
import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'atom';

/**
 * Assigns a required permission atom for a specific route.
 * @param atom - The string representation of the required permission (e.g. 'users.read').
 */
export const Permission = (atom: string) => SetMetadata(PERMISSION_KEY, atom);

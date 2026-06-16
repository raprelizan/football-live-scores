import crypto from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import type { Request } from 'express';
import { ENV } from './env';
import { COOKIE_NAME, ONE_YEAR_MS } from '@shared/const';
import * as db from '../db';
import type { User } from '../../drizzle/schema';

// Password hashing
export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + ENV.cookieSecret)
    .digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  const computedHash = hashPassword(password);
  return computedHash === hash;
}

// JWT Session management
export type SessionPayload = {
  userId: number;
  username?: string;
  role: string;
};

export class AuthService {
  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    return new TextEncoder().encode(secret);
  }

  async createSessionToken(
    userId: number,
    username: string,
    role: string,
    expiresInMs: number = ONE_YEAR_MS
  ): Promise<string> {
    const issuedAt = Date.now();
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({
      userId,
      username,
      role,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(Math.floor(issuedAt / 1000))
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<SessionPayload | null> {
    if (!cookieValue) {
      return null;
    }

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ['HS256'],
      });

      const { userId, username, role } = payload as Record<string, unknown>;

      if (typeof userId !== 'number' || typeof role !== 'string') {
        return null;
      }

      return {
        userId,
        username: typeof username === 'string' ? username : undefined,
        role,
      };
    } catch (error) {
      console.warn('[Auth] Session verification failed', String(error));
      return null;
    }
  }

  async authenticateRequest(req: Request): Promise<User | null> {
    try {
      const cookieHeader = req.headers.cookie;
      if (!cookieHeader) return null;

      const cookies = parseCookies(cookieHeader);
      const sessionCookie = cookies.get(COOKIE_NAME);

      if (!sessionCookie) return null;

      const session = await this.verifySession(sessionCookie);
      if (!session) return null;

      const user = await db.getUserById(session.userId);
      if (!user || !user.isActive) return null;

      // Update last signed in
      await db.updateUserLastSignedIn(user.id);

      return user;
    } catch (error) {
      console.warn('[Auth] Authentication request failed', String(error));
      return null;
    }
  }
}

function parseCookies(cookieHeader: string): Map<string, string> {
  const cookies = new Map<string, string>();
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    const value = rest.join('=').trim();
    cookies.set(name.trim(), decodeURIComponent(value));
  });
  return cookies;
}

export const authService = new AuthService();

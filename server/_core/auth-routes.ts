import type { Express, Request, Response } from 'express';
import { COOKIE_NAME, ONE_YEAR_MS } from '@shared/const';
import * as db from '../db';
import { authService, hashPassword, verifyPassword } from './auth';
import { getSessionCookieOptions } from './cookies';

export function registerAuthRoutes(app: Express) {
  // Admin Login Route
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({
          success: false,
          error: 'Username and password are required',
        });
        return;
      }

      // Find user by username
      const user = await db.getUserByUsername(username);

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
        return;
      }

      // Verify password
      if (!user.passwordHash || !verifyPassword(password, user.passwordHash)) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
        return;
      }

      // Check if user is active and is admin
      if (!user.isActive || user.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: 'Unauthorized access',
        });
        return;
      }

      // Create session token
      const sessionToken = await authService.createSessionToken(
        user.id,
        user.username || '',
        user.role,
        ONE_YEAR_MS
      );

      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('[Auth] Login failed', error);
      res.status(500).json({
        success: false,
        error: 'Login failed',
      });
    }
  });

  // Logout Route
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    try {
      const cookieOptions = getSessionCookieOptions(req);
      res.clearCookie(COOKIE_NAME, { ...cookieOptions });
      res.json({ success: true });
    } catch (error) {
      console.error('[Auth] Logout failed', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed',
      });
    }
  });

  // Get current user
  app.get('/api/auth/me', async (req: Request, res: Response) => {
    try {
      const user = await authService.authenticateRequest(req);
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('[Auth] Get me failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user',
      });
    }
  });

  // Create admin user (only accessible without auth initially or by existing admin)
  app.post('/api/auth/create-admin', async (req: Request, res: Response) => {
    try {
      const { username, password, name } = req.body;

      if (!username || !password) {
        res.status(400).json({
          success: false,
          error: 'Username and password are required',
        });
        return;
      }

      // Check if admin already exists
      const existingAdmin = await db.getUserByUsername(username);
      if (existingAdmin) {
        res.status(409).json({
          success: false,
          error: 'Username already exists',
        });
        return;
      }

      // Hash password
      const passwordHash = hashPassword(password);

      // Create user
      const user = await db.createAdminUser({
        username,
        passwordHash,
        name: name || username,
      });

      res.status(201).json({
        success: true,
        message: 'Admin user created successfully',
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('[Auth] Create admin failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create admin user',
      });
    }
  });
}

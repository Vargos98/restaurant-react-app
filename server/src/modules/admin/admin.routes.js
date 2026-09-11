import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import * as adminController from './admin.controller.js';

export const adminAuthRouter = Router();

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

adminAuthRouter.post('/login', validate(loginSchema), adminController.postLogin);
adminAuthRouter.post('/logout', adminController.postLogout);
adminAuthRouter.get('/me', requireAdmin, adminController.getSession);

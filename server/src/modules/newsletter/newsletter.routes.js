import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import * as newsletterController from './newsletter.controller.js';

export const publicNewsletterRouter = Router();
export const adminNewsletterRouter = Router();

const subscribeSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
});

publicNewsletterRouter.post(
  '/',
  validate(subscribeSchema),
  newsletterController.postSubscribe
);

adminNewsletterRouter.use(requireAdmin);
adminNewsletterRouter.get('/', newsletterController.getSubscribers);

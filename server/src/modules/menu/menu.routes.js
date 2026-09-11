import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import * as menuController from './menu.controller.js';

export const publicMenuRouter = Router();
export const adminMenuRouter = Router();

const menuFields = {
  category: z.enum(['wine', 'cocktail']),
  title: z.string().trim().min(2, 'Title is required'),
  price: z.string().trim().min(1, 'Price is required'),
  tags: z.string().trim().min(1, 'Tags are required'),
  sortOrder: z.coerce.number().int().optional(),
};

const createSchema = z.object(menuFields);
const updateSchema = z.object(menuFields).partial();

publicMenuRouter.get('/', menuController.getPublicMenu);

adminMenuRouter.use(requireAdmin);
adminMenuRouter.get('/', menuController.getAdminMenu);
adminMenuRouter.post('/', validate(createSchema), menuController.postMenuItem);
adminMenuRouter.patch('/:id', validate(updateSchema), menuController.patchMenuItem);
adminMenuRouter.delete('/:id', menuController.removeMenuItem);

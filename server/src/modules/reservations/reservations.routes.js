import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import * as reservationController from './reservations.controller.js';

export const publicReservationRouter = Router();
export const adminReservationRouter = Router();

const reservationSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().min(6, 'Phone is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid date'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Use a valid time'),
  guests: z.coerce.number().int().min(1).max(12),
  notes: z.string().trim().max(500).optional(),
});

const statusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
});

publicReservationRouter.post(
  '/',
  validate(reservationSchema),
  reservationController.postReservation
);

adminReservationRouter.use(requireAdmin);
adminReservationRouter.get('/', reservationController.getReservations);
adminReservationRouter.patch(
  '/:id',
  validate(statusSchema),
  reservationController.patchReservation
);

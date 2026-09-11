import { asyncHandler } from '../../lib/httpError.js';
import * as reservationService from './reservations.service.js';

export const postReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.createReservation(req.body);
  res.status(201).json({ reservation });
});

export const getReservations = asyncHandler(async (req, res) => {
  const reservations = await reservationService.listReservations();
  res.json({ reservations });
});

export const patchReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.updateReservationStatus(
    req.params.id,
    req.body.status
  );
  res.json({ reservation });
});

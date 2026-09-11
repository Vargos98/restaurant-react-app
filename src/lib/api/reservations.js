import { apiRequest } from './client';

export const createReservation = (payload) =>
  apiRequest('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

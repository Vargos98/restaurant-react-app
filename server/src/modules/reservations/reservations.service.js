import { prisma } from '../../lib/prisma.js';
import { HttpError } from '../../lib/httpError.js';

const STATUSES = ['pending', 'confirmed', 'cancelled'];

export const createReservation = async (data) => {
  return prisma.reservation.create({
    data: {
      ...data,
      status: 'pending',
    },
  });
};

export const listReservations = async () => {
  return prisma.reservation.findMany({
    orderBy: [{ date: 'asc' }, { time: 'asc' }, { createdAt: 'desc' }],
  });
};

export const updateReservationStatus = async (id, status) => {
  if (!STATUSES.includes(status)) {
    throw new HttpError(400, 'Status must be pending, confirmed, or cancelled');
  }

  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError(404, 'Reservation not found');
  }

  return prisma.reservation.update({
    where: { id },
    data: { status },
  });
};

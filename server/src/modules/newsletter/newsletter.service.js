import { prisma } from '../../lib/prisma.js';
import { HttpError } from '../../lib/httpError.js';

export const subscribe = async (email) => {
  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(409, 'This email is already on the list');
  }

  return prisma.subscriber.create({ data: { email } });
};

export const listSubscribers = async () => {
  return prisma.subscriber.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

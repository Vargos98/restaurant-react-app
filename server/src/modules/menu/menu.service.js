import { prisma } from '../../lib/prisma.js';
import { HttpError } from '../../lib/httpError.js';

const publicItem = (item) => ({
  id: item.id,
  category: item.category,
  title: item.title,
  price: item.price,
  tags: item.tags,
  sortOrder: item.sortOrder,
});

export const listMenuGrouped = async () => {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { title: 'asc' }],
  });

  return {
    wines: items.filter((item) => item.category === 'wine').map(publicItem),
    cocktails: items.filter((item) => item.category === 'cocktail').map(publicItem),
  };
};

export const listMenuItems = async () => {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { title: 'asc' }],
  });
  return items.map(publicItem);
};

export const createMenuItem = async (data) => {
  const item = await prisma.menuItem.create({ data });
  return publicItem(item);
};

export const updateMenuItem = async (id, data) => {
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError(404, 'Menu item not found');
  }

  const item = await prisma.menuItem.update({ where: { id }, data });
  return publicItem(item);
};

export const deleteMenuItem = async (id) => {
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError(404, 'Menu item not found');
  }

  await prisma.menuItem.delete({ where: { id } });
  return { id };
};

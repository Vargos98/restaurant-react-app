import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const wines = [
  { title: 'Chapel Hill Shiraz', price: '$56', tags: 'AU | Bottle', sortOrder: 1 },
  { title: 'Catena Malbec', price: '$59', tags: 'AR | Bottle', sortOrder: 2 },
  { title: 'La Vieille Rose', price: '$44', tags: 'FR | 750 ml', sortOrder: 3 },
  { title: 'Rhino Pale Ale', price: '$31', tags: 'CA | 750 ml', sortOrder: 4 },
  { title: 'Irish Guinness', price: '$26', tags: 'IE | 750 ml', sortOrder: 5 },
];

const cocktails = [
  { title: 'Aperol Spritz', price: '$20', tags: 'Aperol | Villa Marchesi prosecco | soda | 30 ml', sortOrder: 1 },
  { title: "Dark 'N' Stormy", price: '$16', tags: 'Dark rum | Ginger beer | Slice of lime', sortOrder: 2 },
  { title: 'Daiquiri', price: '$10', tags: 'Rum | Citrus juice | Sugar', sortOrder: 3 },
  { title: 'Old Fashioned', price: '$31', tags: 'Bourbon | Brown sugar | Angostura bitters', sortOrder: 4 },
  { title: 'Negroni', price: '$26', tags: 'Gin | Sweet vermouth | Campari | Orange garnish', sortOrder: 5 },
];

const seed = async () => {
  const email = (process.env.ADMIN_EMAIL || 'admin@fiestalablanc.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin1234';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  const menuCount = await prisma.menuItem.count();
  if (menuCount === 0) {
    await prisma.menuItem.createMany({
      data: [
        ...wines.map((item) => ({ ...item, category: 'wine' })),
        ...cocktails.map((item) => ({ ...item, category: 'cocktail' })),
      ],
    });
  }

  console.log(`Seeded admin ${email} and ${menuCount === 0 ? 'menu items' : 'existing menu kept'}.`);
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

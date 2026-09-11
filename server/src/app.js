import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { publicMenuRouter, adminMenuRouter } from './modules/menu/menu.routes.js';
import {
  publicReservationRouter,
  adminReservationRouter,
} from './modules/reservations/reservations.routes.js';
import {
  publicNewsletterRouter,
  adminNewsletterRouter,
} from './modules/newsletter/newsletter.routes.js';
import { adminAuthRouter } from './modules/admin/admin.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();
  app.set('trust proxy', 1);

  const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim());

  app.use(
    cors({
      origin: origins,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.json({
      name: 'Fiesta La Blanc API',
      ok: true,
      docs: {
        health: '/api/health',
        menu: '/api/menu',
        reservations: 'POST /api/reservations',
        newsletter: 'POST /api/newsletter',
      },
      site: process.env.CLIENT_ORIGIN || null,
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/menu', publicMenuRouter);
  app.use('/api/reservations', publicReservationRouter);
  app.use('/api/newsletter', publicNewsletterRouter);
  app.use('/api/admin', adminAuthRouter);
  app.use('/api/admin/menu', adminMenuRouter);
  app.use('/api/admin/reservations', adminReservationRouter);
  app.use('/api/admin/subscribers', adminNewsletterRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

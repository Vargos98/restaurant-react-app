import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { HttpError } from '../../lib/httpError.js';

const COOKIE_NAME = 'admin_token';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const getCookieOptions = () => {
  const crossSite = process.env.CROSS_SITE_COOKIES === 'true';
  return {
    httpOnly: true,
    sameSite: crossSite ? 'none' : 'lax',
    secure: crossSite || process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE_MS,
    path: '/',
  };
};

export const login = async ({ email, password }) => {
  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!admin) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const token = jwt.sign(
    { sub: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    admin: { id: admin.id, email: admin.email },
  };
};

export const cookieName = COOKIE_NAME;

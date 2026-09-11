import jwt from 'jsonwebtoken';
import { HttpError } from '../lib/httpError.js';

export const requireAdmin = (req, res, next) => {
  const token = req.cookies?.admin_token;
  if (!token) {
    next(new HttpError(401, 'Admin login required'));
    return;
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new HttpError(401, 'Session expired. Please sign in again.'));
  }
};

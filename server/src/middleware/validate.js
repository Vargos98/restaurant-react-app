import { HttpError } from '../lib/httpError.js';

export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || 'Invalid request';
    next(new HttpError(400, message));
    return;
  }

  req.body = parsed.data;
  next();
};

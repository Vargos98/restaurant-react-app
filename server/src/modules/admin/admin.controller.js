import { asyncHandler } from '../../lib/httpError.js';
import * as adminService from './admin.service.js';

export const postLogin = asyncHandler(async (req, res) => {
  const { token, admin } = await adminService.login(req.body);
  res.cookie(adminService.cookieName, token, adminService.getCookieOptions());
  res.json({ admin });
});

export const postLogout = asyncHandler(async (req, res) => {
  res.clearCookie(adminService.cookieName, adminService.getCookieOptions());
  res.json({ ok: true });
});

export const getSession = asyncHandler(async (req, res) => {
  res.json({ admin: { id: req.admin.sub, email: req.admin.email } });
});

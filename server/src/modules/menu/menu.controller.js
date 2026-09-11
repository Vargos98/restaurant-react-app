import { asyncHandler } from '../../lib/httpError.js';
import * as menuService from './menu.service.js';

export const getPublicMenu = asyncHandler(async (req, res) => {
  const menu = await menuService.listMenuGrouped();
  res.json(menu);
});

export const getAdminMenu = asyncHandler(async (req, res) => {
  const items = await menuService.listMenuItems();
  res.json({ items });
});

export const postMenuItem = asyncHandler(async (req, res) => {
  const item = await menuService.createMenuItem(req.body);
  res.status(201).json({ item });
});

export const patchMenuItem = asyncHandler(async (req, res) => {
  const item = await menuService.updateMenuItem(req.params.id, req.body);
  res.json({ item });
});

export const removeMenuItem = asyncHandler(async (req, res) => {
  const result = await menuService.deleteMenuItem(req.params.id);
  res.json(result);
});

import { asyncHandler } from '../../lib/httpError.js';
import * as newsletterService from './newsletter.service.js';

export const postSubscribe = asyncHandler(async (req, res) => {
  const subscriber = await newsletterService.subscribe(req.body.email);
  res.status(201).json({ subscriber });
});

export const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await newsletterService.listSubscribers();
  res.json({ subscribers });
});

import { apiRequest } from './client';

export const subscribeNewsletter = (email) =>
  apiRequest('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

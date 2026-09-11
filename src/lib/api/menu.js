import { apiRequest } from './client';

export const fetchMenu = () => apiRequest('/api/menu');

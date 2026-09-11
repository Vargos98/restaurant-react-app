import { apiRequest } from './client';

export const adminLogin = (email, password) =>
  apiRequest('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const adminLogout = () =>
  apiRequest('/api/admin/logout', { method: 'POST' });

export const fetchAdminSession = () => apiRequest('/api/admin/me');

export const fetchAdminReservations = () => apiRequest('/api/admin/reservations');

export const updateReservationStatus = (id, status) =>
  apiRequest(`/api/admin/reservations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const fetchAdminSubscribers = () => apiRequest('/api/admin/subscribers');

export const fetchAdminMenu = () => apiRequest('/api/admin/menu');

export const createAdminMenuItem = (payload) =>
  apiRequest('/api/admin/menu', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateAdminMenuItem = (id, payload) =>
  apiRequest(`/api/admin/menu/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const deleteAdminMenuItem = (id) =>
  apiRequest(`/api/admin/menu/${id}`, { method: 'DELETE' });

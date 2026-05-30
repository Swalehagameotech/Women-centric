import { getApiBaseUrl } from '../../config/env';

const parseJson = async (response) => {
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }
  return result;
};

const api = async (path, options = {}) => {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return parseJson(response);
};

export const fetchAdminProducts = () => api('/api/products');
export const fetchAdminProduct = (id) => api(`/api/products/${id}`);
export const createAdminProduct = (body) =>
  api('/api/products', { method: 'POST', body: JSON.stringify(body) });
export const updateAdminProduct = (id, body) =>
  api(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteAdminProduct = (id) => api(`/api/products/${id}`, { method: 'DELETE' });

export const fetchAdminCategories = () => api('/api/categories');
export const fetchAdminCategory = (id) => api(`/api/categories/${id}`);
export const createAdminCategory = (body) =>
  api('/api/categories', { method: 'POST', body: JSON.stringify(body) });
export const updateAdminCategory = (id, body) =>
  api(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteAdminCategory = (id) => api(`/api/categories/${id}`, { method: 'DELETE' });

export const fetchAdminUsers = () => api('/api/admin/users');
export const fetchAdminOrders = () => api('/api/admin/orders');

import { getApiBaseUrl } from '../../config/env';
import { getToken } from '../../utils/auth';

const parseJson = async (response) => {
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }
  return result;
};

const api = async (path, options = {}) => {
  const token = getToken();
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  return parseJson(response);
};

const withQuery = (path, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
};

export const fetchAdminProducts = (params = {}) => api(withQuery('/api/products', params));
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
export const updateAdminUserPassword = (id, body) =>
  api(`/api/admin/users/${id}/password`, { method: 'PATCH', body: JSON.stringify(body) });
export const fetchAdminOrders = () => api('/api/admin/orders');
export const fetchAdminOrder = (id) => api(`/api/admin/orders/${id}`);
export const updateAdminOrder = (id, body) =>
  api(`/api/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

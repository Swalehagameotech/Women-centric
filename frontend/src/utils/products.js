import { getApiBaseUrl } from '../config/env';

export const categoryToSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const COLLECTION_BY_SLUG = {
  bestseller: 'Bestseller',
  'new-launch': 'New Launch',
  discount: 'Discount',
};

const COLLECTION_CATEGORY_NAMES = new Set(Object.values(COLLECTION_BY_SLUG));

export const getPrimaryCategory = (categories = []) =>
  categories.find((name) => !COLLECTION_CATEGORY_NAMES.has(name)) || categories[0] || null;

export const findCategoryBySlug = (categories, slug) =>
  categories.find((category) => categoryToSlug(category.name) === slug);

export const resolveCategoryFromSlug = (categories, slug) => {
  const fromDb = findCategoryBySlug(categories, slug);
  if (fromDb) return fromDb;

  const collectionName = COLLECTION_BY_SLUG[slug];
  if (collectionName) {
    return { _id: slug, name: collectionName, subcategory: [], image: '' };
  }

  return null;
};

export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export const fetchProductById = async (id, { signal } = {}) => {
  const response = await fetch(`${getApiBaseUrl()}/api/products/${id}`, { signal });

  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  const result = await response.json();
  return result.data;
};

export const fetchProducts = async ({ category, subcategory, search, signal } = {}) => {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (subcategory) params.set('subcategory', subcategory);
  if (search) params.set('search', search);

  const query = params.toString();
  const response = await fetch(`${getApiBaseUrl()}/api/products${query ? `?${query}` : ''}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const result = await response.json();
  return Array.isArray(result.data) ? result.data : [];
};

export const fetchCategories = async ({ signal } = {}) => {
  const response = await fetch(`${getApiBaseUrl()}/api/categories`, { signal });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const result = await response.json();
  return Array.isArray(result.data) ? result.data : [];
};

export const shuffleProducts = (products) => {
  const shuffled = [...products];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

export const groupProductsBySubcategory = (products, subcategoryOrder = []) => {
  const groups = new Map();

  subcategoryOrder.forEach((sub) => {
    groups.set(sub, []);
  });

  products.forEach((product) => {
    const key = product.subcategory || 'Other';
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(product);
  });

  return Array.from(groups.entries()).filter(([, items]) => items.length > 0);
};

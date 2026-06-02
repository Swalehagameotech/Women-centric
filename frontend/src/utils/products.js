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

// Update this to 70 later when your discount campaign changes.
export const DISCOUNT_PROMO_PERCENT = 50;

const COLLECTION_CATEGORY_NAMES = new Set(Object.values(COLLECTION_BY_SLUG));

export const isCollectionCategory = (category) =>
  COLLECTION_CATEGORY_NAMES.has(category?.name);

export const filterShopCategories = (categories) =>
  (Array.isArray(categories) ? categories : []).filter((category) => !isCollectionCategory(category));

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

export const applyFixedDiscountPercent = (product, percent) => {
  const safePercent = Number(percent);
  const original = Number(product?.original_price ?? product?.discounted_price ?? 0);

  if (!Number.isFinite(safePercent) || !Number.isFinite(original)) {
    return product;
  }

  const discounted = Math.round((original * (100 - safePercent)) / 100);

  return {
    ...product,
    original_price: original,
    discounted_price: discounted,
    discount_percent: safePercent,
  };
};

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

export const mergeProductLists = (...lists) => {
  const merged = [];
  const seen = new Set();

  for (const list of lists) {
    for (const product of list) {
      if (!seen.has(product._id)) {
        merged.push(product);
        seen.add(product._id);
      }
    }
  }

  return merged;
};

export const isSareeProduct = (product) => {
  const subcategory = (product?.subcategory || '').toLowerCase();
  return subcategory.includes('saree');
};

/** Home sections: reserve slots for bags, accessories, perfume, etc., then fill from primary collection. */
export const buildMixedHomeProducts = (primaryProducts, supplementalBuckets, limit) => {
  const picked = [];
  const seen = new Set();

  const tryAdd = (product) => {
    if (!product?._id || seen.has(product._id) || picked.length >= limit) {
      return false;
    }
    seen.add(product._id);
    picked.push(product);
    return true;
  };

  const takeFrom = (products, count, { sareesOnly = false } = {}) => {
    const list = Array.isArray(products) ? products : [];
    const sarees = shuffleProducts(list.filter(isSareeProduct));
    const nonSaree = shuffleProducts(list.filter((item) => !isSareeProduct(item)));
    const pool = sareesOnly ? [...sarees, ...nonSaree] : [...nonSaree, ...sarees];
    let taken = 0;

    for (const product of pool) {
      if (taken >= count) break;
      if (tryAdd(product)) taken += 1;
    }

    return taken;
  };

  for (const { products, count, sareesOnly } of supplementalBuckets) {
    takeFrom(products, count, { sareesOnly });
  }

  const primary = Array.isArray(primaryProducts) ? primaryProducts : [];
  const primaryNonSaree = shuffleProducts(primary.filter((item) => !isSareeProduct(item)));
  const primarySaree = shuffleProducts(primary.filter(isSareeProduct));

  for (const product of [...primaryNonSaree, ...primarySaree]) {
    if (picked.length >= limit) break;
    tryAdd(product);
  }

  return picked;
};

export const fetchMixedHomeProducts = async ({
  signal,
  primaryCategory,
  supplemental = [],
  limit = 10,
}) => {
  const [primary, ...supplementalLists] = await Promise.all([
    fetchProducts({ category: primaryCategory, signal }),
    ...supplemental.map(async ({ category, subcategory, sareesOnly }) => {
      let products = await fetchProducts({ category, subcategory, signal });

      if (sareesOnly && products.length === 0) {
        const fromCategory = await fetchProducts({ category, signal });
        products = fromCategory.filter(isSareeProduct);
      }

      return products;
    }),
  ]);

  const buckets = supplemental.map((entry, index) => ({
    products: supplementalLists[index],
    count: entry.count,
    sareesOnly: entry.sareesOnly,
  }));

  return buildMixedHomeProducts(primary, buckets, limit);
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

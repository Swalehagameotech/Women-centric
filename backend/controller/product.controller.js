import Product from '../model/product.js';

const computeDiscountedPrice = (originalPrice, discountPercent, providedDiscountedPrice) => {
  if (providedDiscountedPrice !== undefined && providedDiscountedPrice !== null) {
    return providedDiscountedPrice;
  }

  const discount = discountPercent ?? 0;
  return Math.round(originalPrice * (1 - discount / 100));
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      images,
      description,
      stock,
      categories,
      subcategory,
      brand,
      original_price,
      discount_percent,
      discounted_price,
    } = req.body;

    const product = await Product.create({
      name,
      images,
      description,
      stock: stock ?? 0,
      categories,
      subcategory,
      brand: brand ?? '',
      original_price,
      discount_percent: discount_percent ?? 0,
      discounted_price: computeDiscountedPrice(
        original_price,
        discount_percent ?? 0,
        discounted_price
      ),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { category, subcategory, brand, search, page, limit } = req.query;
    const filter = {};

    if (category) {
      filter.categories = { $in: [category] };
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    if (brand) {
      filter.brand = brand;
    }

    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(escaped, 'i');

      filter.$or = [
        { name: pattern },
        { brand: pattern },
        { description: pattern },
        { subcategory: pattern },
        { categories: pattern },
      ];
    }

    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.max(1, Number.parseInt(limit, 10) || 0);
    const usePagination = Number.isFinite(pageNumber) && pageSize > 0 && (page || limit);

    const baseQuery = Product.find(filter).sort({ createdAt: -1 });
    const products = usePagination
      ? await baseQuery.skip((pageNumber - 1) * pageSize).limit(pageSize)
      : await baseQuery;
    const total = usePagination ? await Product.countDocuments(filter) : products.length;
    const totalPages = usePagination ? Math.max(1, Math.ceil(total / pageSize)) : 1;

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: usePagination ? pageNumber : 1,
      limit: usePagination ? pageSize : products.length,
      totalPages,
      hasNextPage: usePagination ? pageNumber < totalPages : false,
      hasPrevPage: usePagination ? pageNumber > 1 : false,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const originalPrice =
      req.body.original_price !== undefined
        ? req.body.original_price
        : existingProduct.original_price;

    const discountPercent =
      req.body.discount_percent !== undefined
        ? req.body.discount_percent
        : existingProduct.discount_percent;

    const updateData = {
      ...req.body,
      discounted_price: computeDiscountedPrice(
        originalPrice,
        discountPercent,
        req.body.discounted_price
      ),
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

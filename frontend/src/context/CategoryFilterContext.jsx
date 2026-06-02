import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CategoryFilterContext = createContext(null);

export function CategoryFilterProvider({ children }) {
  const [isActive, setIsActive] = useState(false);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 });
  const [priceMax, setPriceMax] = useState('');

  const setCategoryFilter = useCallback((bounds, maxValue) => {
    setIsActive(true);
    setPriceBounds(bounds);
    setPriceMax(maxValue);
  }, []);

  const clearCategoryFilter = useCallback(() => {
    setIsActive(false);
    setPriceBounds({ min: 0, max: 0 });
    setPriceMax('');
  }, []);

  const resetPriceMax = useCallback(() => {
    setPriceMax(String(priceBounds.max));
  }, [priceBounds.max]);

  const value = useMemo(
    () => ({
      isActive,
      priceBounds,
      priceMax,
      setPriceMax,
      setCategoryFilter,
      clearCategoryFilter,
      resetPriceMax,
    }),
    [isActive, priceBounds, priceMax, setCategoryFilter, clearCategoryFilter, resetPriceMax],
  );

  return (
    <CategoryFilterContext.Provider value={value}>{children}</CategoryFilterContext.Provider>
  );
}

export function useCategoryFilter() {
  const context = useContext(CategoryFilterContext);

  if (!context) {
    throw new Error('useCategoryFilter must be used within CategoryFilterProvider');
  }

  return context;
}

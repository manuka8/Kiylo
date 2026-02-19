import client from './client';

/**
 * Service for Home Screen specific data fetching
 */
export const homeService = {
    /**
     * Fetch featured products for the Hero Section
     */
    getFeaturedProducts: async (limit = 5) => {
        return await client.get('products', {
            params: { is_featured: true, limit }
        });
    },

    /**
     * Fetch categories for the Categories Rail
     */
    getCategories: async () => {
        return await client.get('categories');
    },

    /**
     * Fetch brands for the Brands Slider
     */
    getBrands: async () => {
        return await client.get('brands');
    },

    /**
     * Fetch trending / popular products
     */
    getTrendingProducts: async (limit = 10) => {
        return await client.get('products', {
            params: { sort: 'popular', limit }
        });
    },

    /**
     * Fetch latest products for New Arrivals
     */
    getNewArrivals: async (limit = 10) => {
        return await client.get('products', {
            params: { sort: 'newest', limit }
        });
    },

    /**
     * Search products
     */
    searchProducts: async (query) => {
        return await client.get('products', {
            params: { search: query, limit: 20 }
        });
    }
};

export default homeService;

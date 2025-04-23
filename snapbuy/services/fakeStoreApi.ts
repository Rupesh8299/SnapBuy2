import axios from 'axios';

// Base URL for the Fake Store API
const BASE_URL = 'https://fakestoreapi.com';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Basic error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Convert USD to INR
const convertToINR = (priceInUSD: number): number => {
  const USD_TO_INR_RATE = 83; // Approximate conversion rate
  return Math.round(priceInUSD * USD_TO_INR_RATE);
};

// Convert product prices to INR
const convertProductPrices = (product: any): Product => {
  return {
    ...product,
    price: convertToINR(product.price)
  };
};

// Product interface
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// API functions
export const fakeStoreApi = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products');
      return response.data.map(convertProductPrices);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get a single product by ID
  getProductById: async (id: number): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}`);
      return convertProductPrices(response.data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Get all categories
  getAllCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data.map(convertProductPrices);
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  },
};

export default fakeStoreApi;
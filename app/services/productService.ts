import type { Product } from "../types";

const BASE_URL = "https://mantis-backend.fly.dev/api/v1";

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/products`);
  const data = await response.json();
  return data;
};

export const getProductById = async (id: string | undefined): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  const data = await response.json();
  return data;
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/products/${slug}`);
  const data = await response.json();
  return data;
};

export const getAllCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories`);
  const data = await response.json();
  return data;
};

export const getAllCategoriesById = async (id: string | number) => {
  const response = await fetch(`${BASE_URL}/categories/${id}`);
  const data = await response.json();
  return data;
};
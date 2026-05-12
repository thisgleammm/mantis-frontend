import { apiFetch } from "./apiClient";
import type { Product } from "../types";

export const getAllProducts = async (): Promise<Product[]> => {
  return apiFetch<Product[]>("/products");
};

export const getProductById = async (id: string | undefined): Promise<Product> => {
  return apiFetch<Product>(`/products/${id}`);
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  return apiFetch<Product>(`/products/${slug}`);
};

export const getAllCategories = async () => {
  return apiFetch("/categories");
};

export const getAllCategoriesById = async (id: string | number) => {
  return apiFetch(`/categories/${id}`);
};
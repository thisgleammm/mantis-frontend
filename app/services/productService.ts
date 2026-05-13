import { apiFetch } from "./apiClient";
import type { Product, PaginatedProducts } from "../types";

export const getAllProducts = async (limit = 20, offset = 0, search = ""): Promise<PaginatedProducts> => {
  const query = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  if (search) query.append("q", search);
  return apiFetch<PaginatedProducts>(`/products?${query.toString()}`);
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
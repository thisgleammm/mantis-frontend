export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  discount_price?: number;
  rating_average: number;
  rating_count: number;
  created_at: string;
  variants?: Variant[];
  reviews?: Review[];
  category?: string; // Kept for backward compatibility if used in UI
}


export interface Variant {
  id: string | number;
  variant_name: string;
}

export interface Review {
  id: string | number;
  rating: number;
  comment: string;
  created_at?: string;
  name?: string; // For the ReviewCard component if needed
}

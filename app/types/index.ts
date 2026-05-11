export interface ProductImage {
  id: number;
  image_url: string;
  sort_order: number;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  discount_price?: number;
  weight?: number;
  specifications?: Record<string, any>;
  rating_average: number;
  rating_count: number;
  created_at: string;
  images?: ProductImage[];
  variants?: Variant[];
  reviews?: Review[];
  category?: string;
}



export interface Variant {
  id: number;
  variant_name: string;
  price_extra: number;
  stock: number;
  stock_keeping_unit: string;
}

export interface Review {
  id: string | number;
  rating: number;
  comment: string;
  created_at?: string;
  name?: string; // For the ReviewCard component if needed
}

import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getProductById } from "../services/productService";
import { getCart, getCartItems, addToCart, updateCartItem } from "../services/cartService";
import { ProductDetailSkeleton } from "../components/Skeleton";
import { useTheme } from "../hooks/useTheme";
import type { Product } from "../types";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const cartData = await getCart();
      const cart = Array.isArray(cartData) ? cartData[0] : cartData?.data?.[0];
      if (!cart?.id) {
        navigate("/login");
        return;
      }
      const itemsData = await getCartItems(cart.id);
      const items: any[] = Array.isArray(itemsData)
        ? itemsData
        : itemsData?.items ?? itemsData?.data ?? [];
      const existingItem = items.find((i: any) => i.product_id === product.id);

      if (existingItem) {
        await updateCartItem(cart.id, existingItem.id, existingItem.quantity + 1);
      } else {
        await addToCart(cart.id, product.id, null, 1);
      }
      navigate("/cart");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen px-6 py-10 font-sans bg-gray-50 text-black dark:bg-black dark:text-white">
        <ProductDetailSkeleton />
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black dark:bg-black dark:text-white">
        <p className="text-gray-500 dark:text-gray-400">
          Produk tidak ditemukan.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen px-6 py-10 font-sans bg-gray-50 text-black dark:bg-black dark:text-white">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/products"
          className="text-sm transition mb-8 inline-block text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white"
        >
          ← Back to Products
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 mt-4">
          <div className="flex-1 rounded-2xl flex items-center justify-center text-8xl min-h-72 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-800">
            🛍️
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">
                {product.name}
              </h1>
              <p className="text-sm mb-6 text-gray-500">
                {product.description}
              </p>

              <div className="mb-6">
                {product.discount_price ? (
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-bold text-black dark:text-white">
                      Rp {product.discount_price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-lg line-through text-gray-400 dark:text-gray-500">
                      Rp {product.base_price.toLocaleString("id-ID")}
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-black dark:text-white">
                    Rp {product.base_price.toLocaleString("id-ID")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {product.rating_average ?? 0} / 5.0
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-600">
                  ({product.rating_count ?? 0} reviews)
                </span>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm mb-2 text-gray-500 dark:text-gray-400">
                    Pilih Varian:
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        className="px-4 py-2 rounded-xl border text-sm transition border-black/15 text-black hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
                      >
                        {v.variant_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-xl border text-sm transition border-black/15 text-black hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
              >
                + Tambah ke Cart
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">
            Reviews
          </h2>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-2xl p-4 bg-white border-black/8 dark:bg-white/4 dark:border-white/8"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 text-sm">
                      {"⭐".repeat(review.rating)}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {review.created_at?.slice(0, 10)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-600">
              Belum ada review untuk produk ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

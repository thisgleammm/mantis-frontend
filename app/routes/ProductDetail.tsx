import { useParams, Link, useNavigate } from "react-router";
import { Star } from "lucide-react";
import { useProduct } from "../hooks/queries";
import { getCart, getCartItems, addToCart, updateCartItem } from "../services/cartService";
import { ProductDetailSkeleton } from "../components/Skeleton";
import { useTheme } from "../hooks/ThemeContext";
import { Surface } from "../components/Surface";
import { Button } from "@heroui/react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  useTheme();
  const { data: product, isLoading } = useProduct(id);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const cart = await getCart();
      if (!cart?.id) {
        navigate("/login");
        return;
      }
      const items = await getCartItems(cart.id);
      const existingItem = items.find((i) => i.product_id === product.id);

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

  if (isLoading)
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
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images.sort((a, b) => a.sort_order - b.sort_order)[0].image_url} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-800">
                🛍️
              </div>
            )}
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
                {product.discount_price &&
                product.discount_price > 0 &&
                product.discount_price < product.base_price ? (
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-bold text-black dark:text-white">
                      Rp {product.discount_price.toLocaleString("id-ID")}
                    </p>
                    {product.base_price > 0 ? (
                      <p className="text-lg line-through text-gray-400 dark:text-gray-500">
                        Rp {product.base_price.toLocaleString("id-ID")}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  product.base_price > 0 ? (
                    <p className="text-3xl font-bold text-black dark:text-white">
                      Rp {product.base_price.toLocaleString("id-ID")}
                    </p>
                  ) : null
                )}
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Star size={18} fill="currentColor" className="text-yellow-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {product.rating_average ?? 0} / 5.0
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-600">
                  ({product.rating_count ?? 0} reviews)
                </span>
              </div>

              {product.variants && product.variants.length > 0 ? (
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
              ) : null}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onPress={handleAddToCart}
              >
                + Tambah ke Cart
              </Button>
              <Button
                variant="primary"
                className="flex-1 font-bold"
                onPress={handleAddToCart}
              >
                Beli Sekarang
              </Button>
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
                <Surface
                  key={review.id}
                  variant="secondary"
                  className="border rounded-2xl p-6 transition-all hover:border-accent/20 border-black/5 dark:border-white/5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-400 text-sm">
                      {"⭐".repeat(review.rating)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {review.created_at?.slice(0, 10)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {review.comment}
                  </p>
                </Surface>
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

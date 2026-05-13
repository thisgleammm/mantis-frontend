import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useProduct, useCart } from "../hooks/queries";
import { useAddToCartMutation } from "../hooks/mutations";
import { ProductDetailSkeleton } from "../components/Skeleton";
import { useTheme } from "../hooks/ThemeContext";
import { Surface } from "../components/Surface";
import { Button } from "@heroui/react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  useTheme();
  const { data: product, isLoading } = useProduct(id);
  const { data: cart } = useCart();
  const addToCartMutation = useAddToCartMutation();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product, selectedVariantId]);

  const sortedImages = [...(product?.images || [])].sort((a, b) => a.sort_order - b.sort_order);
  const currentImage = sortedImages[activeImageIndex]?.image_url || "🛍️";

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  };

  const selectedVariant = product?.variants?.find((v) => v.id === selectedVariantId);
  const priceExtra = selectedVariant?.price_extra || 0;
  const basePrice = product?.discount_price && product.discount_price > 0 ? product.discount_price : (product?.base_price || 0);
  const displayPrice = basePrice + priceExtra;

  const handleAddToCart = () => {
    if (!product) return;
    if (!cart?.id) {
      navigate("/login");
      return;
    }
    addToCartMutation.mutate(
      { 
        cartId: cart.id, 
        productId: product.id, 
        variantId: selectedVariantId ?? undefined,
        quantity: 1 
      },
      { onSuccess: () => navigate("/cart") },
    );
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
          <div className="flex-1 flex flex-col gap-4">
            <div className="relative aspect-square rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden group">
              {sortedImages.length > 0 ? (
                <>
                  <img 
                    src={currentImage} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  
                  {sortedImages.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
                      >
                        ←
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
                      >
                        →
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-8xl">🛍️</div>
              )}
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
              <div className="flex gap-2 justify-center">
                {sortedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? "border-purple-500" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
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
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-bold text-purple-500">
                    Rp {displayPrice.toLocaleString("id-ID")}
                  </p>
                  {product.discount_price && product.discount_price < product.base_price && (
                    <p className="text-lg line-through text-gray-400 dark:text-gray-500">
                      Rp {(product.base_price + priceExtra).toLocaleString("id-ID")}
                    </p>
                  )}
                </div>
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
                    {product.variants.map((v) => {
                      const isSelected = selectedVariantId === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                            isSelected
                              ? "border-purple-500 bg-purple-500/10 text-purple-500"
                              : "border-black/15 text-black hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
                          }`}
                        >
                          {v.variant_name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onPress={handleAddToCart}
                isLoading={addToCartMutation.isPending}
              >
                + Tambah ke Cart
              </Button>
              <Button
                className="flex-1 font-bold bg-purple-500 text-white"
                onPress={handleAddToCart}
                isLoading={addToCartMutation.isPending}
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

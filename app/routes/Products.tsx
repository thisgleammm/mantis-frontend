import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Star, Search, SearchX } from "lucide-react";
import { getAllProducts } from "../services/productService";
import { ProductCardSkeleton } from "../components/Skeleton";
import { useTheme } from "../hooks/useTheme";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Surface } from "../components/Surface";
import { Chip } from "../components/Chip";
import { Kbd } from "../components/Kbd";
import type { Product } from "../types";

export default function Products() {
  useTheme();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      if (modifier && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMac]);


  useEffect(() => {
    const fetchProducts = () => {
      getAllProducts()
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="min-h-screen px-6 py-10 font-sans bg-gray-50 text-black dark:bg-black dark:text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 rounded-lg w-48 mb-2 animate-pulse bg-black/8 dark:bg-white/8" />
            <div className="h-4 rounded-lg w-24 animate-pulse bg-black/5 dark:bg-white/5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen px-6 py-10 font-sans bg-gray-50 text-black dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header & Search */}
        <Surface 
          variant="secondary" 
          className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-8 p-10 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl shadow-black/5 dark:shadow-none"
        >
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-br from-black to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
              All Products
            </h1>
            <p className="text-base text-muted-foreground font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Showing <span className="text-foreground font-bold">{filtered.length}</span> products
            </p>
          </div>

          {/* Search */}
          <div className="relative group w-full md:w-96">
            <div className="absolute inset-0 bg-accent/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center">
              <Search 
                size={20} 
                className="absolute left-4 text-muted-foreground group-focus-within:text-accent transition-colors duration-300" 
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-4.5 rounded-2xl border-0 text-base outline-none transition-all duration-300 bg-surface border-black/5 text-foreground placeholder-muted-foreground/40 focus:ring-2 focus:ring-accent/30 dark:bg-black/40 dark:border-white/5 hover:bg-surface/80"
              />
                <Kbd className="absolute right-4 pointer-events-none group-focus-within:hidden border-black/5 dark:border-white/5">
                  <Kbd.Abbr keyValue={isMac ? "command" : "ctrl"} />
                  <Kbd.Content>K</Kbd.Content>
                </Kbd>
            </div>
          </div>
        </Surface>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-24 h-24 rounded-3xl bg-surface-secondary flex items-center justify-center mb-8 border border-black/5 dark:border-white/5">
              <SearchX size={48} className="text-muted-foreground/30" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">
              No results found
            </h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              We couldn't find anything matching "<span className="text-foreground font-semibold">{search}</span>". 
              Try a different keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <Card
                key={product.id}
                onClick={() => navigate(`/products/${product.slug}`)}
                className="group border border-black/8 bg-white dark:border-white/8 dark:bg-white/4 cursor-pointer hover:border-2 hover:border-purple-700"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={
                        [...product.images].sort(
                          (a, b) => a.sort_order - b.sort_order,
                        )[0].image_url
                      }
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-secondary text-5xl">
                      🛍️
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.discount_price && product.discount_price < product.base_price ? (
                    <div className="absolute top-2 right-2 z-10">
                      <Chip
                        color="danger"
                        variant="primary"
                          size="md" 
                        className="font-bold shadow-lg"
                      >
                        {Math.round(
                          ((product.base_price - (product.discount_price || 0)) /
                            product.base_price) *
                            100,
                        )}
                        % OFF
                      </Chip>
                    </div>
                  ) : null}

                </div>

                <CardHeader className="flex flex-col items-start gap-1 p-4 pb-0">
                  <div className="flex justify-between items-start w-full gap-2">
                    <CardTitle className="text-base font-bold tracking-tight transition-colors group-hover:text-accent line-clamp-1 flex-1">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs font-medium text-amber-500 shrink-0">
                      <Star size={14} fill="currentColor" />
                      <span>{product.rating_average || 0}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 pb-5">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      {((product.discount_price &&
                      product.discount_price < product.base_price
                        ? product.discount_price
                        : product.base_price) || 0) > 0 ? (
                        <span className="text-lg font-black text-accent">
                          Rp{" "}
                          {(product.discount_price &&
                          product.discount_price < product.base_price
                            ? product.discount_price
                            : product.base_price
                          ).toLocaleString("id-ID")}
                        </span>
                      ) : null}
                      {product.discount_price &&
                      product.discount_price > 0 &&
                      product.discount_price < product.base_price &&
                      product.base_price > 0 ? (
                        <span className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/50">
                          Rp {product.base_price.toLocaleString("id-ID")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

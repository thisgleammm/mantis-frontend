import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Star, Search, SearchX } from "lucide-react";
import { useProducts } from "../hooks/queries";
import { ProductCardSkeleton } from "../components/Skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Chip } from "../components/Chip";
import { Kbd } from "../components/Kbd";
import { useTheme } from "../hooks/ThemeContext";
import { Pagination } from "@heroui/react";

export default function Products() {
  useTheme();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const limit = 12;
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts(limit, (page - 1) * limit);
  
  const products = data?.products || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

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

  // Note: Client-side filtering only works on current page data.
  // Real search should be server-side.
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading)
    return (
      <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="h-7 rounded w-32 mb-1.5 animate-pulse bg-black/8 dark:bg-white/8" />
            <div className="h-4 rounded w-20 animate-pulse bg-black/5 dark:bg-white/5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen px-6 py-8 font-sans bg-gray-50 text-black dark:bg-black dark:text-white pb-20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">Semua Produk</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{totalItems} produk tersedia</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder={`Cari produk... (${isMac ? "⌘" : "Ctrl"}+K)`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-colors bg-white border-black/10 text-black placeholder-gray-400 focus:border-black/25 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-600 dark:focus:border-white/25"
            />
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <SearchX size={36} className="text-gray-300 dark:text-gray-700 mb-4" />
            <p className="font-semibold text-black dark:text-white">Tidak ada hasil</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tidak ditemukan produk untuk "<span className="text-black dark:text-white">{search}</span>"
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <Card
                  key={product.id}
                  onClick={() => navigate(`/products/${product.slug}`)}
                  className="group border border-black/8 bg-white dark:border-white/8 dark:bg-white/4 cursor-pointer hover:border-2 hover:border-purple-700"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-zinc-900">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl">🛍️</div>
                    )}

                    {product.discount_price && product.discount_price < product.base_price ? (
                      <div className="absolute top-2 right-2">
                        <Chip color="danger" variant="primary" size="sm" className="font-bold text-xs">
                          {Math.round(((product.base_price - product.discount_price) / product.base_price) * 100)}% OFF
                        </Chip>
                      </div>
                    ) : null}
                  </div>

                  <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-sm font-semibold tracking-tight group-hover:text-accent transition-colors line-clamp-1 flex-1">
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-medium">{product.rating_average || 0}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-3 pt-1.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-accent">
                        Rp {(product.discount_price && product.discount_price < product.base_price
                          ? product.discount_price
                          : product.base_price
                        ).toLocaleString("id-ID")}
                      </span>
                      {product.discount_price && product.discount_price < product.base_price ? (
                        <span className="text-xs text-gray-400 line-through">
                          Rp {product.base_price.toLocaleString("id-ID")}
                        </span>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <Pagination className="w-full max-w-6xl">
                  <Pagination.Summary className="text-xs text-gray-500 dark:text-gray-400">
                    Showing <span className="text-black dark:text-white font-medium">{((page - 1) * limit) + 1}</span>-{Math.min(page * limit, totalItems)} of {totalItems} products
                  </Pagination.Summary>
                  <Pagination.Content>
                    <Pagination.Item>
                      <Pagination.Previous 
                        isDisabled={page === 1} 
                        onPress={() => {
                          setPage((p) => p - 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <Pagination.PreviousIcon />
                        <span>Previous</span>
                      </Pagination.Previous>
                    </Pagination.Item>

                    {(() => {
                      const pages: (number | "ellipsis")[] = [];
                      if (totalPages <= 7) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        pages.push(1);
                        if (page > 3) pages.push("ellipsis");
                        const start = Math.max(2, page - 1);
                        const end = Math.min(totalPages - 1, page + 1);
                        for (let i = start; i <= end; i++) pages.push(i);
                        if (page < totalPages - 2) pages.push("ellipsis");
                        pages.push(totalPages);
                      }
                      return pages;
                    })().map((p, i) =>
                      p === "ellipsis" ? (
                        <Pagination.Item key={`ellipsis-${i}`}>
                          <Pagination.Ellipsis />
                        </Pagination.Item>
                      ) : (
                        <Pagination.Item key={p}>
                          <Pagination.Link 
                            isActive={p === page} 
                            onPress={() => {
                              setPage(p as number);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            {p}
                          </Pagination.Link>
                        </Pagination.Item>
                      )
                    )}

                    <Pagination.Item>
                      <Pagination.Next 
                        isDisabled={page === totalPages} 
                        onPress={() => {
                          setPage((p) => p + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <span>Next</span>
                        <Pagination.NextIcon />
                      </Pagination.Next>
                    </Pagination.Item>
                  </Pagination.Content>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

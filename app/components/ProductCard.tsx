import { Link } from "react-router";
import type { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {


  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h2 className="text-white font-semibold">{product.name}</h2>
      <Link 
        to={`/products/${product.id}`}
        className="text-purple-400 text-sm hover:text-purple-300 transition"
      >
        Lihat Detail
      </Link>
    </div>
  );
}
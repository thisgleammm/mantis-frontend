import { Link } from "react-router";
import type { Review } from "../types";

export default function ReviewCard({ review }: { review: Review }) {

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h2 className="text-white font-semibold">{review.name}</h2>
      <Link 
        to={`/review/${review.id}`}
        className="text-purple-400 text-sm hover:text-purple-300 transition"
      >
        Review
      </Link>
    </div>
  );
}
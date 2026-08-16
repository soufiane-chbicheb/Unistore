import React, { useEffect, useRef, useState } from "react";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";
import { ThemePalette } from "@/types/theme";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

const initialReviews: Review[] = [
  { id: "1", userName: "Sarah Johnson", rating: 5, comment: "Absolutely love this product! The quality is outstanding and it fits perfectly.", date: "10 Oct 2024", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "2", userName: "Mike Chen", rating: 4, comment: "Premium feel and clean design. Would love more color options.", date: "08 Oct 2024", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "3", userName: "Emma Davis", rating: 5, comment: "Exceeded my expectations. Will definitely buy again.", date: "05 Oct 2024", avatar: "https://i.pravatar.cc/150?img=3" },
];

interface ReviewsProps {
  theme?: ThemePalette;
}

const renderStars = (rating: number) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={`w-4 h-4 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
    ))}
  </div>
);

const ReviewMaker = ({ theme }: ReviewsProps) => {
  const t = theme;
  const [reviews, setReviews] = useState(initialReviews);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<any>(null);
  const [newReview, setNewReview] = useState({ userName: "", rating: 0, comment: "" });
  const [hoveredRating, setHoveredRating] = useState(0);

  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  const next = () => setIndex((i) => (i + 1) % reviews.length);
  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    intervalRef.current = setInterval(next, 3000);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [reviews.length]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.rating || !newReview.comment) return;
    const review: Review = {
      id: Date.now().toString(),
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };
    setReviews([review, ...reviews]);
    setNewReview({ userName: "", rating: 0, comment: "" });
    setIndex(0);
  };

  const cardStyle = {
    background: t?.bgSecondary ?? "#fff",
    border: `1px solid ${t?.border ?? "#e2e8f0"}`,
    borderRadius: t?.borderRadius ?? "16px",
    color: t?.text,
  };

  const inputStyle = {
    background: t?.card ?? "#fff",
    border: `1px solid ${t?.border ?? "#e2e8f0"}`,
    color: t?.text,
    borderRadius: t?.borderRadius ?? "12px",
    outline: "none",
    width: "100%",
    padding: "12px 16px",
  };

  return (
    <div className="space-y-12 p-6">
      {/* SUMMARY + SLIDER */}
      <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-stretch">
        <div className="p-6 flex flex-col justify-between" style={cardStyle}>
          <div>
            <div className="text-5xl font-bold" style={{ color: t?.text }}>{avg.toFixed(1)}</div>
            <div className="mt-2">{renderStars(Math.round(avg))}</div>
            <p className="text-sm mt-1" style={{ color: t?.textMuted }}>Based on {reviews.length} reviews</p>
          </div>
          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((r) => {
              const count = reviews.filter((rv) => rv.rating === r).length;
              const pct = (count / reviews.length) * 100;
              return (
                <div key={r} className="flex items-center gap-2">
                  <span className="text-sm w-4" style={{ color: t?.text }}>{r}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: t?.border ?? "#e2e8f0" }}>
                    <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="w-full p-6 shadow-sm flex flex-col justify-between h-full" style={cardStyle}>
            <div className="flex items-center gap-3 mb-4">
              <img src={reviews[index].avatar} className="w-12 h-12 rounded-full" />
              <div>
                <div className="font-medium" style={{ color: t?.text }}>{reviews[index].userName}</div>
                <div className="text-xs" style={{ color: t?.textMuted }}>{reviews[index].date}</div>
              </div>
            </div>
            {renderStars(reviews[index].rating)}
            <p className="mt-4 leading-relaxed flex-1" style={{ color: t?.textSecondary ?? t?.text }}>{reviews[index].comment}</p>
          </div>
          <button
            onClick={prev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full p-2 shadow"
            style={{ background: t?.bgSecondary ?? "#fff", border: `1px solid ${t?.border}`, color: t?.text }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full p-2 shadow"
            style={{ background: t?.bgSecondary ?? "#fff", border: `1px solid ${t?.border}`, color: t?.text }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ADD REVIEW FORM */}
      <div className="p-6 w-full" style={{ ...cardStyle, background: t?.card ?? "#f8fafc" }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: t?.text }}>Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={newReview.userName}
            onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
            style={inputStyle}
          />

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setNewReview({ ...newReview, rating: s })}
                onMouseEnter={() => setHoveredRating(s)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <Star className={`w-5 h-5 transition ${s <= (hoveredRating || newReview.rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
              </button>
            ))}
          </div>

          <textarea
            rows={4}
            placeholder="Share your experience with this product..."
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            style={{ ...inputStyle, resize: "none" }}
          />

          <button
            className="w-full py-3 font-semibold transition-opacity hover:opacity-90"
            style={{
              background: t?.primary ?? "#0f172a",
              color: t?.textInverse ?? "#fff",
              borderRadius: t?.borderRadius ?? "12px",
            }}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewMaker;

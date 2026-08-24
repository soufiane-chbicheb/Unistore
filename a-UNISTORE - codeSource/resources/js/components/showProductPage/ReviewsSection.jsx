import React from "react";
import StarRating from "./StarRating";

const ReviewsSection = ({ reviews, averageRating }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getRatingDistribution = () => {
        const distribution = [0, 0, 0, 0, 0];
        reviews.forEach((review) => {
            const starIndex = Math.floor(review.rating) - 1;
            if (starIndex >= 0 && starIndex < 5) {
                distribution[4 - starIndex]++; // Reverse order for display
            }
        });
        return distribution;
    };

    const ratingDistribution = getRatingDistribution();

    return (
        <div className="space-y-8">
            {/* Rating Overview */}
            <div className="border-b pb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Reviews
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-2">
                                {averageRating.toFixed(1)}
                            </div>
                            <StarRating
                                rating={averageRating}
                                size="lg"
                                showNumber={false}
                            />
                            <p className="text-gray-600 mt-2">
                                Based on {reviews.length} reviews
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars, index) => (
                            <div
                                key={stars}
                                className="flex items-center space-x-3"
                            >
                                <span className="text-sm text-gray-600 w-8">
                                    {stars}
                                </span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 transition-all duration-300"
                                        style={{
                                            width: `${
                                                reviews.length > 0
                                                    ? (ratingDistribution[
                                                          index
                                                      ] /
                                                          reviews.length) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 w-8">
                                    {ratingDistribution[index]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="border-b pb-6 last:border-b-0"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="font-semibold text-gray-900">
                                    {review.username}
                                </h4>
                                <StarRating
                                    rating={review.rating}
                                    size="sm"
                                    showNumber={false}
                                />
                            </div>
                            <span className="text-sm text-gray-500">
                                {formatDate(review.date)}
                            </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            {review.comment}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsSection;

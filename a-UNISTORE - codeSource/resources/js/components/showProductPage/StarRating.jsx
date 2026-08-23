import React from "react";
import { Star } from "lucide-react";

const StarRating = ({
    rating,
    maxRating = 5,
    size = "md",
    showNumber = true,
}) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= maxRating; i++) {
            const filled = i <= rating;
            const halfFilled = i - 0.5 === rating;

            stars.push(
                <div key={i} className="relative">
                    <Star
                        className={`${sizeClasses[size]} ${
                            filled
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                        }`}
                    />
                    {halfFilled && (
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star
                                className={`${sizeClasses[size]} text-yellow-400 fill-current`}
                            />
                        </div>
                    )}
                </div>
            );
        }
        return stars;
    };

    return (
        <div className="flex items-center space-x-1">
            <div className="flex space-x-0.5">{renderStars()}</div>
            {showNumber && (
                <span
                    className={`text-gray-600 ${
                        size === "sm"
                            ? "text-sm"
                            : size === "lg"
                            ? "text-lg"
                            : "text-base"
                    }`}
                >
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;

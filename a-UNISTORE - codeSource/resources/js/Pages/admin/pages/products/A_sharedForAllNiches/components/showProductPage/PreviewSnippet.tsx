import React from "react";

interface PreviewSnippetProps {
  description?: string;
  rating?: number;
  maxDescriptionLength?: number;
}

export const PreviewSnippet: React.FC<PreviewSnippetProps> = ({
  description = "",
  rating = 0,
  maxDescriptionLength = 150,
}) => {
  const truncatedDescription =
    description.length > maxDescriptionLength
      ? description.substring(0, maxDescriptionLength) + "..."
      : description;

  const renderStars = (ratingValue: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= Math.round(ratingValue) ? "text-amber-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600 ml-1">({ratingValue}/5)</span>
      </div>
    );
  };

  return (
    <div className="space-y-3 py-3 border-t border-gray-200">
      {truncatedDescription && (
        <div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {truncatedDescription}
          </p>
          <p className="text-xs text-blue-600 mt-1 hover:text-blue-700 cursor-pointer">
            See more details below
          </p>
        </div>
      )}
      {rating > 0 && (
        <div className="flex items-center gap-2">
          {renderStars(rating)}
        </div>
      )}
    </div>
  );
};

export default PreviewSnippet;

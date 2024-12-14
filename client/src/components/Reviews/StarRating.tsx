import { useState } from "react";
import { Star } from "lucide-react";
import { ReviewInput } from "@/services/review.services";

type Props = {
  setProjectedReview: React.Dispatch<React.SetStateAction<number>>;
  setReview: React.Dispatch<React.SetStateAction<ReviewInput>>;
};

const StarRating = ({ setReview, setProjectedReview }: Props) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0); // Holds the final rating after clicking

  const handleMouseEnter = (index: number) => {
    setHoveredStar(index); // Highlight stars on hover
    setProjectedReview(index); // Update external state
  };

  const handleMouseLeave = () => {
    setHoveredStar(null); // Reset hover highlight
    setProjectedReview(0);
  };

  const handleClick = (index: number) => {
    setRating(index); // Set the final rating
    setReview((prevReview) => ({
      ...prevReview,
      rating: index,
    })); // Update external review state
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (
        <Star
          key={star}
          className={`cursor-pointer w-6 h-6 ${
            star <= (hoveredStar || rating) ? "fill-yellow-500" : "fill-none"
          } stroke-yellow-500`}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;

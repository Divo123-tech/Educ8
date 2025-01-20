import { Star } from "lucide-react";
import { FaStarHalfAlt } from "react-icons/fa";

type Props = {
  rating: number;
};

const StarDisplay = ({ rating }: Props) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((number) => (
        <span key={number}>
          {number <= rating ? (
            <Star fill="#94751e" color="#94751e" size={12} />
          ) : number - 0.5 > rating ? (
            <Star fill="#FFFFFF" color="#94751e" size={12} />
          ) : (
            <FaStarHalfAlt fill="#94751e" color="#94751e" size={12} />
          )}
        </span>
      ))}
    </div>
  );
};

export default StarDisplay;

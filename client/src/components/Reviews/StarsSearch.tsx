import { Course } from "@/services/courses.service";
import { getReviews } from "@/services/review.services";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  stars: number;
  course: Course | null;
  handleReviewsFilter: (stars: number) => void;
};

const StarsSearch = ({ stars, course, handleReviewsFilter }: Props) => {
  const [totalFiltered, setTotalFiltered] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    (async () => {
      const response = await getReviews(course?.id || "", stars);
      setTotalFiltered(response.count);
    })();
    (async () => {
      const response = await getReviews(course?.id || "");
      setTotal(response.count);
    })();
  }, [course, stars]);

  const decimalToPercent = () => {
    const number = Math.round((totalFiltered / total) * 100);
    if (isNaN(number)) {
      return "0";
    }

    return number;
  };

  return (
    <div
      className="flex items-center cursor-pointer gap-1 sm:gap-4"
      onClick={() => handleReviewsFilter(stars)}
    >
      <div className="w-16 sm:w-64 lg:w-80 bg-gray-300 h-2">
        <div className={`h-full bg-gray-600 w-[${decimalToPercent()}%]`}></div>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center sm:gap-1">
          {Array.from({ length: 5 }, (_, i) => i).map((number: number) => {
            if (number < stars) {
              return <Star fill="#94751e" color="#94751e" size={14} />;
            } else {
              return <Star fill="#FFFFFF" color="#94751e" size={14} />;
            }
          })}
        </div>
        <p className="text-green-600 underline underline-offset-2 text-sm">
          {decimalToPercent()}%
        </p>
      </div>
    </div>
  );
};

export default StarsSearch;

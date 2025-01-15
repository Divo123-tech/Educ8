import { Review } from "@/services/review.services";
import { Star } from "lucide-react";
import { FaStarHalfAlt } from "react-icons/fa";

type Props = {
  review: Review;
};

const CoursePreviewReview = ({ review }: Props) => {
  function formatTimestamp(timestamp: Date) {
    try {
      // Parse the ISO 8601 timestamp into a Date object
      const date = new Date(timestamp);

      // Format the date and time components
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      // Combine components into the desired format
      return `${day}/${month}/${year} - ${hours}:${minutes}`;
    } catch (error: unknown) {
      console.error(error);
      return "Invalid timestamp format";
    }
  }
  return (
    <div className="flex flex-col flex-wrap gap-2 border-t border-gray-300 py-4">
      <div className="flex gap-4">
        {review.reviewed_by?.profile_picture &&
        typeof review.reviewed_by.profile_picture == "string" ? (
          <img
            src={
              import.meta.env.VITE_API_URL + review.reviewed_by.profile_picture
            }
            alt="profile"
            className="rounded-full w-8 h-8 xl:w-12 xl:h-12"
          />
        ) : (
          <div className="bg-black rounded-full w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center">
            <p className="font-bold text-white text-lg xl:text-xl">
              {review.reviewed_by?.username
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </p>
          </div>
        )}
        <div className="flex flex-col justify-around">
          <p className="text-sm font-bold">{review.reviewed_by.username}</p>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((number) => (
              <span key={number}>
                {number <= review.rating ? (
                  <Star fill="#e1a03b" color="#94751e" size={12} />
                ) : number - 0.5 > 3.7 ? (
                  <Star fill="#FFFFFF" color="#94751e" size={12} />
                ) : (
                  <FaStarHalfAlt fill="#e1a03b" color="#94751e" size={12} />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="font-bold">{review?.title}</p>
      <p>{review?.description}</p>
      <p className="text-gray-400 text-xs font-bold">
        {formatTimestamp(review?.created_at)}
      </p>
    </div>
  );
};

export default CoursePreviewReview;

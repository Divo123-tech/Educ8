import { Course } from "@/services/courses.service";
import { Star } from "lucide-react";
import { FaStarHalfAlt } from "react-icons/fa";

type Props = {
  course: Course | null;
};

const CoursePreviewHome = ({ course }: Props) => {
  return (
    <div className="p-4 flex border gap-4 cursor-pointer hover:opacity-70">
      <img
        src={typeof course?.thumbnail == "string" ? course.thumbnail : ""}
        className="w-1/3 h-fit"
      ></img>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-xl">{course?.name}</h1>
        <p className="text-sm">{course?.description}</p>
        <p className="text-gray-600 text-xs">By {course?.creator.username}</p>
        <div className="flex items-center gap-1">
          <p className="font-bold">{course?.average_rating || "4.5"}</p>
          {Array.from({ length: 5 }, (_, i) => i + 1).map((number) => (
            <span key={number}>
              {number <= 3.2 ? (
                <Star fill="#94751e" color="#94751e" size={12} />
              ) : number - 0.5 > 3.2 ? (
                <Star fill="#FFFFFF" color="#94751e" size={12} />
              ) : (
                <FaStarHalfAlt fill="#94751e" color="#94751e" size={12} />
              )}
            </span>
          ))}
        </div>
        <p className="mt-auto font-bold text-md">${course?.price}</p>
      </div>
    </div>
  );
};

export default CoursePreviewHome;

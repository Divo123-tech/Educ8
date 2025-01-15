import { Course } from "@/services/courses.service";
import { Star } from "lucide-react";
import { FaStarHalfAlt } from "react-icons/fa";

type Props = {
  course: Course;
};

const CourseSearchView = ({ course }: Props) => {
  return (
    <div className="flex flex-col gap-4 cursor-pointer hover:opacity-70">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <img
            src={typeof course.thumbnail == "string" ? course.thumbnail : ""}
            className="w-52 h-fit"
          ></img>
          <div className="flex flex-col justify-between">
            <h1 className="font-bold text-md">{course?.title}</h1>
            <p className="text-sm">{course?.subtitle}</p>
            <p className="text-gray-600 text-xs"> {course?.creator.username}</p>
            <div className="flex items-center gap-2">
              <p className="font-bold">
                {course?.average_rating?.toFixed(1) || "4.5"}
              </p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((number) => (
                  <span key={number}>
                    {number <= 3.2 ? (
                      <Star fill="#94751e" color="#94751e" size={14} />
                    ) : number - 0.5 > 3.2 ? (
                      <Star fill="#FFFFFF" color="#94751e" size={14} />
                    ) : (
                      <FaStarHalfAlt fill="#94751e" color="#94751e" size={14} />
                    )}
                  </span>
                ))}
              </div>
              <p className="text-xs underline underline-offset-2 text-green-700">
                ({course.reviews.length} ratings)
              </p>
            </div>
          </div>
        </div>
        <p className="font-bold text-md">${course?.price}</p>
      </div>
      <hr className="border"></hr>
    </div>
  );
};

export default CourseSearchView;

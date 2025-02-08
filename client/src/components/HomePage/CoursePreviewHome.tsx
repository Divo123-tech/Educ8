import { Course } from "@/services/courses.service";
import StarDisplay from "../StarDisplay";
import { Link } from "react-router-dom";

type Props = {
  course: Course | null;
};

const CoursePreviewHome = ({ course }: Props) => {
  return (
    <Link
      to={`/preview-course/${course?.id}`}
      className="p-4 flex border gap-4 cursor-pointer hover:opacity-70"
    >
      <img
        src={typeof course?.thumbnail == "string" ? course.thumbnail : ""}
        className="w-1/3 h-fit object-cover object-center"
      ></img>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-xl">{course?.title}</h1>
        <h1 className="text-lg">{course?.subtitle}</h1>
        <p className="text-gray-600 text-xs">By {course?.creator.username}</p>
        <div className="flex items-center gap-1">
          <p className="font-bold">{course?.average_rating || "0.0"}</p>
          <StarDisplay rating={course?.average_rating || 0} />
        </div>
        <p className="mt-auto font-bold text-md">${course?.price}</p>
      </div>
    </Link>
  );
};

export default CoursePreviewHome;

import { Link } from "react-router-dom";

export type DropdownCourseType = {
  id: number;
  title: string;
  creator: string;
  image: File | null | undefined;
  isCart: boolean;
};

const DropdownCourse = ({
  id,
  title,
  creator,
  image,
  isCart,
}: DropdownCourseType) => {
  return (
    <Link
      to={isCart ? `/cart` : `/course/${id}`}
      className="text-gray-600 hover:text-primary pt-4 rounded-md text-sm font-normal flex flex-col gap-2"
    >
      <div className="flex items-start gap-2">
        <img
          src={
            typeof image == "string" ? import.meta.env.VITE_API_URL + image : ""
          }
          className="w-20 h-fit"
        />
        <div className="flex flex-col">
          <p className="font-bold text-xs">
            {title.slice(0, 30)}
            {title.length > 30 && "..."}
          </p>
          <p className="font-semibold text-xs text-gray-400">{creator}</p>
        </div>
      </div>
      <hr></hr>
    </Link>
  );
};

export default DropdownCourse;

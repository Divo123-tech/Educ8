import { Course } from "@/services/courses.service";
import NoThumbnail from "@/assets/NoThumbnail.png";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getCurrentUser } from "@/services/users.service";
import { toast } from "@/hooks/use-toast";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { Link } from "react-router-dom";
import { postCourseToCart } from "@/services/cart.service";
import StarDisplay from "../StarDisplay";
type Props = {
  course: Course;
  showAddToCart?: boolean;
  preview?: boolean;
};

const CourseHomeScreen = ({
  course,
  showAddToCart = true,
  preview = true,
}: Props) => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { setUser } = userContext;
  const addCourseToCart = async () => {
    try {
      await postCourseToCart(course.id);

      setUser(await getCurrentUser());
      toast({
        title: "Status",
        description: "Succesfully added course to cart!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Status",
        description: "Failed to add course to cart!",
        variant: "destructive",
      });
    }
  };
  return (
    <HoverCard>
      <Link
        to={preview ? `/preview-course/${course.id}` : `/course/${course.id}`}
      >
        <div className="flex flex-col w-48 gap-1 cursor-pointer hover:opacity-80 py-4">
          <HoverCardTrigger>
            <img
              src={
                typeof course.thumbnail == "string"
                  ? course.thumbnail
                  : NoThumbnail
              }
              className="w-52 h-28 border object-cover object-center"
            ></img>
          </HoverCardTrigger>
          <div className="flex gap-1 flex-col">
            <h1 className="font-bold text-wrap text-sm">
              {course.title.slice(0, 45)}
              {course.title.length > 45 && "..."}
            </h1>
            <p className="text-xs text-gray-500">{course.creator.username}</p>
          </div>
          <div className="flex gap-2">
            <p className="font-bold text-xs">
              {course.average_rating?.toFixed(1) || "0.0"}
            </p>
            <StarDisplay rating={course.average_rating || 0} />
          </div>
          <p className="font-bold text-sm">${course.price}</p>
        </div>
      </Link>
      {showAddToCart && (
        <HoverCardContent className="w-52" side="bottom" sideOffset={-100}>
          <div className="flex justify-center flex-col gap-2 ">
            <h2 className="font-bold text-xs">
              {course.title.slice(0, 40)}
              {course.title?.length > 40 && "..."}
            </h2>
            <p className="text-xs text-gray-600">
              {course.subtitle
                ? course.subtitle?.slice(0, 200)
                : "No subtitle available"}
              {course.subtitle?.length > 200 && "..."}
            </p>

            <button
              className="bg-green-700 text-white font-bold px-4 py-2 mt-1 text-xs hover:opacity-80"
              onClick={addCourseToCart}
            >
              Add To Cart
            </button>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default CourseHomeScreen;

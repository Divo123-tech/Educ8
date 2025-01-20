import { Course } from "@/services/courses.service";
import React, { useContext } from "react";
import NoThumbnail from "@/assets/NoThumbnail.png";
import { Trash2 } from "lucide-react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

import DeleteDialog from "../DeleteDialog";
import {
  CartItem,
  deleteCourseInCart,
  getCartItems,
} from "@/services/cart.service";
import { getCurrentUser } from "@/services/users.service";
import { UserContext } from "@/context/UserContext";
import StarDisplay from "../StarDisplay";
type Props = {
  id: number | string;
  course: Course;
  currentPage: number;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[] | null>>;
  setPreviousPage: React.Dispatch<React.SetStateAction<string | null>>;
  setNextPage: React.Dispatch<React.SetStateAction<string | null>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
};

const CourseCartView = ({
  id,
  course,
  currentPage,
  setCartItems,
  setPreviousPage,
  setNextPage,
  setTotal,
}: Props) => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { setUser } = userContext;
  const handleDelete = async () => {
    await deleteCourseInCart(id);
    const response = await getCartItems(currentPage);
    setCartItems(response.results);
    setPreviousPage(response.previous);
    setNextPage(response.next);
    setTotal(response.count);
    setUser(await getCurrentUser());
  };

  return (
    <div className="px-2 py-4 cursor-pointer">
      <div className="flex justify-between gap-1 items-start">
        <div className="flex gap-4">
          <img
            src={
              typeof course.thumbnail == "string"
                ? import.meta.env.VITE_API_URL + course.thumbnail
                : NoThumbnail
            }
            className="w-32 h-fit"
          ></img>
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-sm">{course.title}</h1>
            <p className="text-xs text-gray-500">
              By {course.creator.username}
            </p>
            <div className="flex items-center gap-2">
              <p className="font-bold text-xs">
                {course.average_rating?.toFixed(1) || "0.0"}
              </p>
              <StarDisplay rating={course.average_rating || 0} />
              <p className="text-xs text-gray-500">
                ({course.reviews.length} ratings)
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="font-bold text-md">${course.price}</p>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>
                <Trash2 size={16} cursor={"pointer"} />
              </MenubarTrigger>

              <DeleteDialog
                handleDelete={handleDelete}
                deleteMessage="Are you sure you want to remove this course from your cart?"
                deleteButtonMessage="Delete"
              />
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      <hr className="mt-4"></hr>
    </div>
  );
};

export default CourseCartView;

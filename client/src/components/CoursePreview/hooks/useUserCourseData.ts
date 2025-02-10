import { User, UserContext } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { getCourseInCart, postCourseToCart } from "@/services/cart.service";
import { getCourseInUserCourse } from "@/services/courses.service";
import { getCurrentUser } from "@/services/users.service";
import { useContext, useEffect, useState } from "react";

// Custom hook for user-specific course data
const useUserCourseData = (courseId: string, user: User | null) => {
  const [isCourseInCart, setIsCourseInCart] = useState<boolean>(false);
  const [isCourseInUserCourse, setIsCourseInUserCourse] =
    useState<boolean>(false);
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { setUser } = userContext;
  useEffect(() => {
    if (!courseId || !user) return;

    const fetchUserData = async () => {
      try {
        const [cartStatus, userCourseStatus] = await Promise.all([
          getCourseInCart(courseId),
          getCourseInUserCourse(courseId),
        ]);

        setIsCourseInCart(cartStatus);
        setIsCourseInUserCourse(userCourseStatus);
      } catch (error) {
        console.error("Error fetching user course data:", error);
      }
    };

    fetchUserData();
  }, [courseId, user]);

  const addCourseToCart = async () => {
    try {
      await postCourseToCart(Number(courseId));
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);

      toast({
        title: "Status",
        description: "Successfully added course to cart!",
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

  return {
    isCourseInCart,
    isCourseInUserCourse,
    addCourseToCart,
  };
};
export default useUserCourseData;

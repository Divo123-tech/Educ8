import { Course } from "./courses.service";
import { fetchWithAuth } from "./users.service";

export const postCourseToCart = async (courseId: number | string) => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/cart`;
    const course = await fetchWithAuth({
      url,
      method: "POST",
      data: { course: courseId },
    });
    return course;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const deleteCourseInCart = async (id: number | string) => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/cart`;
    const course = await fetchWithAuth({
      url,
      method: "DELETE",
      data: { course: id },
    });
    return course;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export type CartItem = {
  id: string;
  student: string;
  course: Course;
};

export type CartResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CartItem[];
};

export const getCartItems = async (page: number) => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/cart?page=${page}`;
    const course = await fetchWithAuth<CartResponse>({
      url,
      method: "GET",
    });
    return course;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getCourseInCart = async (courseId: number | string) => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/cart/${courseId}`;
    const isCourseInCart = await fetchWithAuth<boolean>({
      url,
      method: "GET",
    });
    return isCourseInCart;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const checkoutCartItems = async (cartItems: CartItem[]) => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/cart/checkout`;
    const response = await fetchWithAuth<boolean>({
      url,
      data: { cartItems },
      method: "POST",
    });
    return response;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

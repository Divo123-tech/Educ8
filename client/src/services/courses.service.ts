// import axios from "axios";
import axios from "axios";
import { fetchWithAuth } from "./users.service";
export interface Course {
  id: number;
  creator: {
    id: number;
    username: string;
  };
  sections: number[];
  average_rating: number | null;
  title: string;
  subtitle: string;
  description: string;
  created_at: string; // ISO date string
  last_updated_at: string; // ISO date string
  published_at: string | null; // ISO date string or null
  published: boolean;
  thumbnail?: File | null;
  category: string;
  students: number[];
  price: number;
  reviews: number[];
}

export const addCourse = async (
  title: string,
  subtitle: string,
  description: string,
  category: string
): Promise<Course> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/courses/`;
    const course = await fetchWithAuth<Course>({
      url,
      method: "POST",
      data: { title, description, category, subtitle },
    });
    return course;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export type CoursesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Course[];
};

export const getCoursesTaught = async (
  page: number,
  search: string
): Promise<CoursesResponse> => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/taught?page=${page}&search=${search}`;
    const response = await fetchWithAuth<CoursesResponse>({
      url,
      method: "GET",
    });
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export type UserCourseItem = {
  id: string;
  student: string;
  course: Course;
  joined_at: string;
};

export type UserCourseResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserCourseItem[];
};

export const getCoursesTaken = async (
  page: number,
  search?: string,
  category?: string
): Promise<UserCourseResponse> => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/users/my-courses?page=${page}&search=${search || ""}&category=${
      category || ""
    }`;
    const response = await fetchWithAuth<UserCourseResponse>({
      url,
      method: "GET",
    });
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getCourseInUserCourse = async (courseId: number | string) => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/users/my-courses/${courseId}`;
    const isCourseInUserCourse = await fetchWithAuth<boolean>({
      url,
      method: "GET",
    });
    return isCourseInUserCourse;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getCourses = async (
  page: number,
  search?: string,
  creator?: string
): Promise<CoursesResponse> => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/?page=${page}&search=${search || ""}&creator=${
      creator || ""
    }`;
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const deleteCourse = async (courseId: number) => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/courses/${courseId}`;
    const course = await fetchWithAuth({
      url,
      method: "DELETE",
    });
    return course;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getSingleCourse = async (courseId: string | number) => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/courses/${courseId}`;
    const response = await axios.get<Course>(url);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const editCourse = async (
  courseId: string,
  course: FormData
): Promise<Course> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/courses/${courseId}`;
    const editedCourse = await fetchWithAuth<Course>({
      url,
      method: "PATCH",
      data: course,
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });
    return editedCourse;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const publishCourse = async (
  courseId: number,
  publish: boolean
): Promise<Course> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/courses/${courseId}`;
    const editedCourse = await fetchWithAuth<Course>({
      url,
      method: "PATCH",
      data: { published: publish },
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });
    return editedCourse;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const refundCourse = async (courseId: string | number) => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/my-courses`;
    const refundCourse = await fetchWithAuth<boolean>({
      url,
      method: "DELETE",
      data: { course: courseId },
    });
    return refundCourse;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
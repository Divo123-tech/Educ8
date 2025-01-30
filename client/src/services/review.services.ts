import axios from "axios";
import { fetchWithAuth } from "./users.service";
import { User } from "@/context/UserContext";

export type ReviewInput = {
  title: string;
  description: string;
  rating: number;
};

export type Review = {
  id: string | number;
  title: string;
  description: string;
  rating: number;
  reviewed_by: User;
  course: number | string;
  created_at: Date;
};

export type ReviewResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Review[];
};

export const postReview = async (
  courseId: number | string,
  review: ReviewInput
) => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/reviews`;
    const sectionContent = await fetchWithAuth<Review>({
      url,
      method: "POST",
      data: review,
    });
    return sectionContent;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getReviews = async (
  courseId: number | string,
  rating?: string | number
): Promise<ReviewResponse> => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/reviews${
      rating != undefined ? `?rating=${rating}` : ""
    }`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const deleteReview = async (
  courseId: string | number,
  reviewId: string | number
) => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/reviews/${reviewId}`;
    const response = await fetchWithAuth({ url, method: "DELETE" });
    return response;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

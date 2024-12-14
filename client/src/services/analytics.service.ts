import { fetchWithAuth } from "./users.service";
export type PublishedAmount = {
  published_count: number;
  unpublished_count: number;
  total: number;
};
export const getNumberOfPublishedCourses = async () => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/analytics/published-status`;
    const data = await fetchWithAuth<PublishedAmount>({
      url,
      method: "GET",
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export type CourseRevenue = {
  id: number;
  title: string;
  price: number;
  revenue: number;
  total_students: number;
};
export const getCoursesRevenue = async () => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/analytics/course-revenue`;
    const data = await fetchWithAuth<CourseRevenue[]>({
      url,
      method: "GET",
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

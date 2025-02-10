import { Course, getSingleCourse } from "@/services/courses.service";
import { getReviews, Review } from "@/services/review.services";
import { useEffect, useState } from "react";

const useReviews = (
  courseId: string,
  courseInfoShown: string,
  setCourse: React.Dispatch<React.SetStateAction<Course | null>>
) => {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAllReviews = async () => {
    try {
      const [courseData, reviewsResponse] = await Promise.all([
        getSingleCourse(courseId),
        getReviews(courseId),
      ]);

      setReviews(reviewsResponse.results);
      setPreviousPage(reviewsResponse.previous);
      setNextPage(reviewsResponse.next);
      setTotal(reviewsResponse.count);
      setCourse(courseData);
      return courseData;
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (courseInfoShown === "review" && courseId) {
      fetchAllReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, courseInfoShown, currentPage]);

  const handleReviewsFilter = async (rating: number) => {
    const response = await getReviews(courseId, rating);
    setReviews(response.results);
    setPreviousPage(response.previous);
    setNextPage(response.next);
    setTotal(response.count);
  };

  return {
    reviews,
    previousPage,
    nextPage,
    total,
    currentPage,
    setCurrentPage,
    handleReviewsFilter,
    fetchAllReviews,
  };
};

export default useReviews;

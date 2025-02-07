import { getSingleCourse } from "@/services/courses.service";
import { getReviews, Review } from "@/services/review.services";
import { useEffect, useState } from "react";

const useReviews = (courseId: string, courseInfoShown: string) => {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewLoading, setReviewLoading] = useState<boolean>(true);

  const fetchAllReviews = async () => {
    setReviewLoading(true);
    try {
      const [courseData, reviewsResponse] = await Promise.all([
        getSingleCourse(courseId),
        getReviews(courseId),
      ]);

      setReviews(reviewsResponse.results);
      setPreviousPage(reviewsResponse.previous);
      setNextPage(reviewsResponse.next);
      setTotal(reviewsResponse.count);
      setReviewLoading(false);
      return courseData;
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
    setReviewLoading(false);
  };

  useEffect(() => {
    if (courseInfoShown === "review" && courseId) {
      fetchAllReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, courseInfoShown, currentPage]);

  const handleReviewsFilter = async (rating: number) => {
    setReviewLoading(true);

    const response = await getReviews(courseId, rating);
    setReviews(response.results);
    setPreviousPage(response.previous);
    setNextPage(response.next);
    setReviewLoading(false);
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
    reviewLoading,
  };
};

export default useReviews;

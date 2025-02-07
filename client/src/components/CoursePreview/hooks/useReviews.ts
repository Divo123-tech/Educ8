import { getReviews, Review } from "@/services/review.services";
import { useEffect, useState } from "react";

const useReviews = (courseId: string) => {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewLoading, setReviewLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchReviews = async () => {
      setReviewLoading(true);
      try {
        const reviewsResponse = await getReviews(courseId);
        setReviews(reviewsResponse.results);
        setPreviousPage(reviewsResponse.previous);
        setNextPage(reviewsResponse.next);
        setTotal(reviewsResponse.count);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
      setReviewLoading(false);
    };

    fetchReviews();
  }, [courseId, currentPage]);

  const handleReviewsFilter = async (rating: number) => {
    setReviewLoading(true);
    const response = await getReviews(courseId, rating);
    setReviews(response.results);
    setPreviousPage(response.previous);
    setNextPage(response.next);
    setTotal(response.count);
    setReviewLoading(false);
  };

  return {
    reviews,
    previousPage,
    nextPage,
    total,
    currentPage,
    setCurrentPage,
    handleReviewsFilter,
    reviewLoading,
  };
};

export default useReviews;

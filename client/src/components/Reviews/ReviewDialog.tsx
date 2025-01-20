import { CircleAlert, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChangeEvent, useEffect, useState } from "react";
import { CircleCheckBig } from "lucide-react";
import StarRating from "./StarRating";
import { postReview, ReviewInput } from "@/services/review.services";

type Props = {
  courseId: string | number;
  fetchAllReviews: () => void;
};
const ReviewDialog = ({ courseId, fetchAllReviews }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [review, setReview] = useState<ReviewInput>({
    title: "",
    description: "",
    rating: 0,
  });

  const [projectedReview, setProjectedReview] = useState<number>(0);
  const [reviewSuccess, setReviewSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (reviewSuccess) {
      const timeout = setTimeout(() => {
        setReviewSuccess(null);
      }, 3000); // Adjust the timeout duration as needed (e.g., 3000ms = 3 seconds)

      return () => clearTimeout(timeout); // Cleanup the timeout when `courseSuccess` changes
    }
  }, [reviewSuccess]);

  const handleInputChange = (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>
  ) => {
    setReview((prevReview) => {
      return {
        ...prevReview,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleClose = () => {
    setReviewSuccess(null);
    setProjectedReview(0);
    setReview({
      title: "",
      description: "",
      rating: 0,
    });
  };
  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await postReview(courseId, review);
      console.log(response);
      setReviewSuccess(true);
      setProjectedReview(0);
      setReview({
        title: "",
        description: "",
        rating: 0,
      });
      fetchAllReviews();
    } catch (e: unknown) {
      console.error(e);
      setReviewSuccess(false);
    }
  };

  const mapRatingtoText = (rating: number) => {
    switch (rating) {
      case 0:
        return "Select Rating";
      case 1:
        return "Awful not what I expected at all";
      case 2:
        return "Awful/poor";
      case 3:
        return "Average, could be better";
      case 4:
        return "Good, what I expected";
      case 5:
        return "Amazing! Above expectations";
    }
  };

  const isFormEmpty =
    review.rating == 0 || review.description == "" || review.title == "";
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          handleClose(); // Executes only when the dialog is closed
        }
      }}
    >
      <DialogTrigger>
        <div className="cursor-pointer flex items-center gap-1 ">
          <p className="text-white text-xs hover:text-[#e1a03b] ">
            Leave a Review
          </p>
          <Star fill="#000000" color="#94751e" size={14} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-lg text-center">
            How would you rate this course?
          </DialogTitle>
          <DialogDescription>
            {reviewSuccess && (
              <div className="flex items-center gap-4 bg-green-300 px-3 py-3">
                <CircleCheckBig className="text-black" />
                <p className="text-black font-medium">
                  Successfully made review!
                </p>
              </div>
            )}
            {reviewSuccess == false && (
              <div className="flex items-center gap-4 bg-red-300 px-3 py-3">
                <CircleAlert className="flex-shrink-0 text-black" />

                <p className="text-black font-medium">Failed to make review!</p>
              </div>
            )}
            <form
              className="flex flex-col gap-4 mt-2"
              onSubmit={handleFormSubmit}
            >
              <div className="flex flex-col items-center justify-center gap-2 font-bold text-black text-md">
                <p>
                  {projectedReview != 0
                    ? mapRatingtoText(projectedReview)
                    : mapRatingtoText(review.rating)}
                </p>
                <StarRating
                  setReview={setReview}
                  setProjectedReview={setProjectedReview}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">Title</label>
                <input
                  placeholder="Enter title for your review"
                  name="title"
                  className="border border-black px-2 py-2 text-sm"
                  onChange={handleInputChange}
                ></input>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">Body</label>
                <textarea
                  placeholder="Tell us about your own personal experience taking this course. Was it a good match for you?"
                  name="description"
                  className="border border-black px-2 py-2 text-sm"
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-black text-white px-3 py-2 font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isFormEmpty}
                >
                  Add Review
                </button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;

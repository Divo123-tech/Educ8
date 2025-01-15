import { UserContext } from "@/context/UserContext";
import { deleteReview, Review } from "@/services/review.services";
import { Star, Trash2 } from "lucide-react";
import { useContext } from "react";
import DeleteDialog from "../DeleteDialog";
import { Menubar, MenubarMenu, MenubarTrigger } from "../ui/menubar";

type Props = {
  review: Review;
  fetchAllReviews: () => void;
};

const ReviewComponent = ({ review, fetchAllReviews }: Props) => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { user } = userContext;
  const handleDelete = async () => {
    try {
      await deleteReview(review.course || "", review.id || "");
      fetchAllReviews();
    } catch (err: unknown) {
      console.error(err);
    }
  };
  function formatTimestamp(timestamp: Date) {
    try {
      // Parse the ISO 8601 timestamp into a Date object
      const date = new Date(timestamp);

      // Format the date and time components
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      // Combine components into the desired format
      return `${day}/${month}/${year} - ${hours}:${minutes}`;
    } catch (error: unknown) {
      console.error(error);
      return "Invalid timestamp format";
    }
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div>
          {review.reviewed_by?.profile_picture &&
          typeof review.reviewed_by.profile_picture == "string" ? (
            <img
              src={
                import.meta.env.VITE_API_URL +
                review.reviewed_by.profile_picture
              }
              alt="profile"
              className="rounded-full w-8 h-8 xl:w-12 xl:h-12"
            />
          ) : (
            <div className="bg-black rounded-full w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center">
              <p className="font-bold text-white text-lg xl:text-xl">
                {review.reviewed_by?.username
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </p>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-bold">{review.reviewed_by.username}</p>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => i + 1).map((number) => (
                <span key={number}>
                  {number <= review.rating ? (
                    <Star fill="#e1a03b" color="#94751e" size={12} />
                  ) : (
                    <Star fill="#FFFFFF" color="#94751e" size={12} />
                  )}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {formatTimestamp(review.created_at)}
            </p>
          </div>
          <p className="font-bold text-sm">{review.title}</p>
          <p className="text-xs">{review.description}</p>
        </div>
        <div className="ml-auto">
          {user?.id == review.reviewed_by.id && (
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="px-0">
                  <Trash2 size={16} cursor={"pointer"} />
                </MenubarTrigger>

                <DeleteDialog
                  deleteButtonMessage="Delete"
                  handleDelete={handleDelete}
                  deleteMessage="Are you sure you want to delete this review?"
                />
              </MenubarMenu>
            </Menubar>
          )}
        </div>
      </div>
      <hr />
    </div>
  );
};

export default ReviewComponent;

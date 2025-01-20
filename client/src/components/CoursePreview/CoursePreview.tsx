import {
  Course,
  getCourseInUserCourse,
  getSingleCourse,
} from "@/services/courses.service";
import { Star } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { FaStarHalfAlt } from "react-icons/fa";
import { useParams, useNavigate } from "react-router";
import { BadgeAlert } from "lucide-react";
import { TbBrandVolkswagen } from "react-icons/tb";
import { BsMicrosoft } from "react-icons/bs";
import { SiMercedes } from "react-icons/si";
import { FaAmazon, FaGoogle } from "react-icons/fa";
import { Accordion } from "@/components/ui/accordion";
import { getSections, Section } from "@/services/sections.services";
import SectionPreview from "./SectionPreview";
import { User, UserContext } from "@/context/UserContext";
import { getCurrentUser, getUserInfo } from "@/services/users.service";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { getCourseInCart, postCourseToCart } from "@/services/cart.service";
import { getReviews, Review } from "@/services/review.services";
import CoursePreviewReview from "./CoursePreviewReview";
import StarsSearch from "../Reviews/StarsSearch";
import Pagination from "../Pagination";
import StarDisplay from "../StarDisplay";

const CoursePreview = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[] | null>(null);
  const [instructor, setInstructor] = useState<User | null>(null);
  const [isCourseInCart, setIsCourseInCart] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCourseInUserCourse, setIsCourseInUserCourse] =
    useState<boolean>(false);
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { user, setUser } = userContext;
  const handleReviewsFilter = async (rating: number) => {
    const response = await getReviews(courseId || "", rating);
    console.log(response);
    setReviews(response.results);
    setPreviousPage(response.previous);
    setNextPage(response.next);
    setTotal(response.count);
  };
  const addCourseToCart = async () => {
    try {
      await postCourseToCart(courseId || 0);

      setUser(await getCurrentUser());
      toast({
        title: "Status",
        description: "Succesfully added course to cart!",
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

  useEffect(() => {
    (async () => {
      setCourse(await getSingleCourse(courseId || ""));
      const sections = await getSections(courseId || "");
      setSections(sections);
      setInstructor(await getUserInfo(course?.creator.id || ""));
      const reviewsResponse = await getReviews(courseId || "");
      console.log(reviewsResponse);
      setReviews(reviewsResponse.results);
      setReviews(reviewsResponse.results);
      setPreviousPage(reviewsResponse.previous);
      setNextPage(reviewsResponse.next);
      setTotal(reviewsResponse.count);
      if (user) {
        setIsCourseInCart(await getCourseInCart(courseId || ""));
        setIsCourseInUserCourse(await getCourseInUserCourse(courseId || ""));
      }
    })();
  }, [course?.creator.id, courseId, user]);
  return (
    <div className="flex flex-col gap-8 pb-4">
      <div className="flex flex-col md:flex-row justify-center bg-[#1c1d1f] pb-8 gap-16">
        <div className="flex flex-col gap-5 px-3 md:w-1/3 pt-12 ">
          <h1 className="text-3xl font-bold text-white">{course?.title}</h1>
          <p className="text-white">{course?.subtitle}</p>
          <div className="flex gap-2">
            <p className="font-bold text-xs text-[#e1a03b]">
              {course?.average_rating?.toFixed(1) || "4.6"}
            </p>
            <StarDisplay rating={course?.average_rating || 0} />
            <p className="text-xs underline underline-offset-2 text-green-400">
              ({course?.reviews.length} ratings)
            </p>
            <p className="text-xs text-white">156 Students</p>
          </div>
          <Link to={`/user/${instructor?.id}`}>
            <p className="text-xs text-white">
              Created By{" "}
              <span className=" underline underline-offset-2 text-green-400">
                {course?.creator.username}
              </span>
            </p>
          </Link>
          <div className="flex gap-2 items-center">
            <BadgeAlert color="white" size={14} />

            <p className="text-white text-xs">
              Last Updated at: {course?.last_updated_at}
            </p>
          </div>
        </div>
        <div className=" mt-4 flex flex-col justify-center items-center">
          <img
            src={typeof course?.thumbnail == "string" ? course.thumbnail : ""}
            className="w-56"
          ></img>
          <div className="px-2 py-4 flex flex-col gap-2 bg-white w-56">
            <p className="font-bold text-lg">${course?.price}</p>

            <div className="flex justify-center border-black border cursor-pointer hover:bg-gray-200">
              <button
                className="py-2 font-bold"
                onClick={
                  isCourseInUserCourse
                    ? () => navigate(`/course/${courseId}`)
                    : isCourseInCart
                    ? () => navigate("/cart")
                    : addCourseToCart
                }
              >
                {isCourseInUserCourse
                  ? "Go to Course"
                  : isCourseInCart
                  ? "Go to Cart"
                  : "Add to Cart"}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-xs text-center">
                30-Day Money-Back Guarantee
              </p>
              <p className="text-gray-500 text-xs text-center">
                Full Lifetime Access
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center ">
        <div className="w-fit border py-3 px-4 flex flex-col gap-2">
          <h1 className="font-bold text-sm">
            Top companies offer this course to their employees
          </h1>
          <p className="text-xs text-gray-500">
            This course was selected for our collection of top-rated courses
            trusted by businesses worldwide.
          </p>
          <div className="flex justify-between px-4 pt-4">
            <FaGoogle className="text-2xl text-gray-500" />
            <FaAmazon className="text-2xl text-gray-500" />
            <SiMercedes className="text-2xl text-gray-500" />
            <TbBrandVolkswagen className="text-2xl text-gray-500" />
            <BsMicrosoft className="text-2xl text-gray-500" />
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-28 md:px-36 xl:px-96 flex flex-col gap-6">
        <div className=" flex flex-col gap-4">
          <h1 className="font-bold text-2xl">Course Content</h1>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              {course?.sections.length} sections
            </p>
            <Accordion type="multiple" className="w-full border bg-[#f8f9fa] ">
              {sections?.map((section: Section, index: number) => {
                return (
                  <SectionPreview
                    value={index}
                    section={section}
                    courseId={course?.id || 0}
                    key={section.id}
                  />
                );
              })}
            </Accordion>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-bold text-2xl">Description</p>
          <p
            dangerouslySetInnerHTML={{ __html: course?.description || "" }}
          ></p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Instructor</h1>
          <Link to={`/user/${instructor?.id}`}>
            <p className="font-bold text-green-700 underline underline-offset-4">
              {instructor?.username}
            </p>
          </Link>
          {instructor?.profile_picture &&
          typeof instructor.profile_picture == "string" ? (
            <img
              src={instructor.profile_picture}
              alt="profile"
              className="rounded-full w-24 h-24"
            />
          ) : (
            <div className="bg-black rounded-full w-24 h-24 flex items-center justify-center">
              <p className="font-bold text-white text-4xl">
                {instructor?.username
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </p>
            </div>
          )}
          <p dangerouslySetInnerHTML={{ __html: instructor?.bio || "" }}></p>
        </div>
        <div id="reviews-container" className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Star fill="#e1a03b" color="#e1a03b" size={18} />
            <p className="font-bold text-2xl">
              {course?.average_rating?.toFixed(1) || "4.3"} course rating
            </p>
            <span className="w-2 h-2 bg-gray-400 mt-1 rounded-full"></span>
            <p className="font-bold text-2xl">
              {course?.reviews.length} reviews
            </p>
            <div className="ml-auto">
              <Pagination
                previousPage={previousPage}
                currentPage={currentPage}
                nextPage={nextPage}
                total={total}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>

          <div className="w-full">
            {Array.from({ length: 5 }, (_, index) => (
              <StarsSearch
                key={index}
                stars={5 - index}
                course={course}
                handleReviewsFilter={handleReviewsFilter}
              />
            ))}
          </div>
          <div className="flex justify-between flex-wrap">
            {reviews?.map((review) => {
              return (
                <div className="w-[45%]" key={review.id}>
                  <CoursePreviewReview review={review} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;

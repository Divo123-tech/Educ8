import { Section } from "@/services/sections.services";
import { refundCourse } from "@/services/courses.service";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";
import SectionFull from "./SectionFull";
import { Accordion } from "../ui/accordion";
import { BadgeAlert, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { FaStarHalfAlt } from "react-icons/fa";
import ReviewDialog from "../Reviews/ReviewDialog";
import { Review } from "@/services/review.services";
import StarsSearch from "../Reviews/StarsSearch";
import ReviewComponent from "../Reviews/Review";
import { Menubar, MenubarMenu, MenubarTrigger } from "../ui/menubar";
import DeleteDialog from "../DeleteDialog";
import { getCurrentUser } from "@/services/users.service";
import { UserContext } from "@/context/UserContext";
import Pagination from "../Pagination";
import useCourseContent from "./hooks/useCourseContent";
import useReviews from "./hooks/useReviews";
import useCourseAccess from "./hooks/useCourseAccess";
import Logo from "@/assets/LogoLight.png";
import CourseHomePageSkeleton from "../Skeleton/CourseHomePageSkeleton";
const CourseFull = () => {
  const [courseInfoShown, setCourseInfoShown] = useState<string>("content");
  const { courseId } = useParams();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("CourseFull must be used within a UserContext Provider");
  }

  const { setUser } = userContext;

  // Use custom hooks
  useCourseAccess(courseId || "");
  const { course, sections, currentContent, instructor, selectSectionContent } =
    useCourseContent(courseId || "");
  const {
    reviews,
    previousPage,
    nextPage,
    total,
    currentPage,
    setCurrentPage,
    handleReviewsFilter,
    fetchAllReviews,
    reviewLoading,
  } = useReviews(courseId || "", courseInfoShown);

  const handleDelete = async () => {
    try {
      await refundCourse(course?.id || "");
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
      navigate("/my-learning");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="h-screen">
      <div className="bg-[#1c1d1f] flex items-center gap-2 lg:gap-6 px-2 sm:px-8 py-4 border-b border-gray-600">
        <Link to="/" className="text-white text-sm">
          <img src={Logo} className="h-6 sm:h-6"></img>
        </Link>
        {/* Vertical Divider */}
        <div className="h-4 border-l border-gray-400"></div>
        <h1 className="text-white text-xs sm:text-sm">{course?.title}</h1>
        <div className="flex ml-auto gap-1 sm:gap-4 items-center">
          <ReviewDialog
            courseId={courseId || ""}
            fetchAllReviews={fetchAllReviews}
          />
          <div className="h-4 border-l border-gray-400"></div>
          <Menubar className="bg-[#1c1d1f] cursor-pointer">
            <MenubarMenu>
              <MenubarTrigger className="px-0">
                <p className="text-red-500 text-xs font-bold cursor-pointer">
                  Refund Course
                </p>
              </MenubarTrigger>

              <DeleteDialog
                deleteButtonMessage="Refund"
                handleDelete={handleDelete}
                deleteMessage="Are you sure you want to refund this course?"
              />
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      <div className="h-1/3 sm:h-2/3 border border-[#1c1d1f] overflow-y-scroll">
        {currentContent?.contentType == "text" && (
          <div className="flex flex-col items-center py-8 px-24 gap-8 ">
            <h1 className="font-bold text-3xl">{currentContent?.title}</h1>
            <p
              dangerouslySetInnerHTML={{
                __html: currentContent?.content || "",
              }}
            ></p>
          </div>
        )}
        {currentContent?.contentType == "image" && (
          <div className="relative flex justify-center gap-8 overflow-y-scroll h-full bg-[#1c1d1f]">
            {/* Text Overlay */}
            <div className="absolute top-0 left-10 p-4 text-white bg-[#1c1d1f] bg-opacity-50 text-sm">
              {currentContent.title}
            </div>

            {/* Image */}
            <img
              src={
                typeof currentContent.media === "string"
                  ? currentContent.media
                  : ""
              }
              alt="Content"
              className="h-full object-contain"
            />
          </div>
        )}
        {currentContent?.contentType == "video" && (
          <div className="relative flex justify-center gap-8 overflow-y-scroll h-full bg-[#1c1d1f]">
            {/* Text Overlay */}
            <div className="absolute top-0 left-10 p-4 text-white bg-[#1c1d1f] bg-opacity-50 text-sm">
              {currentContent.title}
            </div>

            {/* Image */}
            <video
              src={
                typeof currentContent.media === "string"
                  ? currentContent.media
                  : ""
              }
              controls
              className="h-full object-contain"
            />
          </div>
        )}
      </div>

      <div className="px-4 sm:px-16 md:px-32 xl:px-48">
        <div className="py-4 flex gap-12">
          <p
            className={`${
              courseInfoShown == "content"
                ? "underline font-bold underline-offset-8"
                : "text-gray-500"
            } cursor-pointer`}
            onClick={() => setCourseInfoShown("content")}
          >
            Content
          </p>
          <p
            className={`${
              courseInfoShown == "overview"
                ? "underline font-bold underline-offset-8"
                : "text-gray-500"
            } cursor-pointer`}
            onClick={() => setCourseInfoShown("overview")}
          >
            Overview
          </p>{" "}
          <p
            className={`${
              courseInfoShown == "review"
                ? "underline font-bold underline-offset-8"
                : "text-gray-500"
            } cursor-pointer`}
            onClick={() => setCourseInfoShown("review")}
          >
            Review
          </p>
        </div>
        <hr></hr>
      </div>
      {courseInfoShown == "content" && (
        <div className="flex flex-col xl:px-48 py-12 items-center">
          <Accordion type="multiple" className="w-2/3 border bg-[#f8f9fa] ">
            {sections?.map((section: Section, index: number) => {
              return (
                <SectionFull
                  value={index}
                  section={section}
                  courseId={course?.id || 0}
                  key={section.id}
                  selectSectionContent={selectSectionContent}
                />
              );
            })}
          </Accordion>
        </div>
      )}
      {courseInfoShown == "overview" && (
        <div className="px-4 sm:px-16 md:px-32 xl:px-48 py-4 flex flex-col gap-4">
          <div>
            <p className="sm:text-xl">{course?.subtitle}</p>
          </div>
          <div className="flex gap-2 xs:gap-12 items-center">
            <div>
              <div className="flex gap-1 items-center">
                <p className="font-bold">
                  {course?.average_rating?.toFixed(1) || 4.6}
                </p>
                <Star size={18} fill="#e1a03b" color="#94751e" />
              </div>
              <p className="text-gray-600 text-[0.7rem] text-nowrap xs:text-xs">
                {course?.reviews.length || 100} ratings
              </p>
            </div>
            <div>
              <div className="flex gap-1 items-center">
                <p className="font-bold">{course?.students}</p>
              </div>
              <p className="text-gray-600 text-xs">Students</p>
            </div>
            <div>
              <div className="flex gap-2 items-center">
                <BadgeAlert color="black" size={16} />

                <p className="text-[0.7rem] sm:text-sm xs:font-semibold">
                  Last Updated at: {course?.last_updated_at}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p
              dangerouslySetInnerHTML={{ __html: course?.description || "" }}
              className="text-sm text-justify xs:text-md"
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
        </div>
      )}
      {courseInfoShown == "review" && (
        <>
          <div className="px-4 sm:px-16 md:px-32 xl:px-96 py-8 flex flex-col gap-4">
            <div>
              <h1 className="font-bold text-xl xl:text-2xl">
                Student Feedback
              </h1>
            </div>
            <div className="flex  gap-8">
              <div className="flex flex-col gap-2 w-fit items-center">
                <p className="text-4xl xl:text-5xl font-bold text-[#94751e]">
                  {course?.average_rating?.toFixed(1) || "0.0"}
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((number) => (
                    <span key={number}>
                      {number <= (course?.average_rating || 0) ? (
                        <Star fill="#e1a03b" color="#94751e" size={14} />
                      ) : number - 0.5 > (course?.average_rating || 0) ? (
                        <Star fill="#FFFFFF" color="#94751e" size={14} />
                      ) : (
                        <FaStarHalfAlt
                          fill="#e1a03b"
                          color="#94751e"
                          size={14}
                        />
                      )}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-bold text-[#94751e] text-nowrap">
                  Course Rating
                </p>
              </div>
              <div>
                {Array.from({ length: 5 }, (_, index) => (
                  <StarsSearch
                    key={index}
                    stars={5 - index}
                    course={course}
                    handleReviewsFilter={handleReviewsFilter}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h1
                className="text-xl font-bold cursor-pointer hover:underline"
                onClick={fetchAllReviews}
              >
                All Reviews ({total})
              </h1>
              <div className="flex flex-col gap-4">
                {reviewLoading ? (
                  <>
                    <CourseHomePageSkeleton />
                  </>
                ) : (
                  <>
                    {reviews?.map((review: Review) => {
                      return (
                        <ReviewComponent
                          review={review}
                          key={review.id}
                          fetchAllReviews={fetchAllReviews}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
          <Pagination
            previousPage={previousPage}
            currentPage={currentPage}
            nextPage={nextPage}
            total={total}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default CourseFull;

import { User } from "@/context/UserContext";
import { Course, getCourses } from "@/services/courses.service";
import { getUserInfo } from "@/services/users.service";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CourseHomeScreen from "../HomePage/CourseHomeScreen";
import { ChevronLeft, ChevronRight } from "lucide-react";

const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [showCoursesTaught, setShowCoursesTaught] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const toggleCoursesShown = () => {
    setShowCoursesTaught((prevCourseTaught) => !prevCourseTaught);
    setCourses([]);
    setPreviousPage(null);
    setNextPage(null);
    setCurrentPage(1);
  };
  useEffect(() => {
    (async () => {
      setUserProfile(await getUserInfo(userId || 0));
    })();
  }, [userId]);
  useEffect(() => {
    if (showCoursesTaught) {
      (async () => {
        const response = await getCourses(currentPage, "", userId);
        setCourses(response.results);
        setPreviousPage(response.previous);
        setNextPage(response.next);
        setTotal(response.count);
      })();
    }
  }, [nextPage, currentPage, previousPage, total, userId, showCoursesTaught]);
  return (
    <div className="flex flex-col gap-8 px-4 sm:px-28 md:px-16 lg:px-48 xl:px-72 py-8 w-fit">
      <div className="flex flex-col sm:flex-row justify-between gap-8 xl:gap-36 items-center">
        <h1 className="text-3xl xl:text-4xl font-bold font-serif">
          {userProfile?.username}
        </h1>
        {userProfile?.profile_picture &&
        typeof userProfile.profile_picture == "string" ? (
          <img
            src={userProfile.profile_picture}
            alt="profile"
            className="rounded-full xl:w-36 xl:h-36"
          />
        ) : (
          <div className="bg-black rounded-full w-24 h-24 xl:w-36 xl:h-36 flex items-center justify-center">
            <p className="font-bold text-white text-3xl xl:text-5xl">
              {userProfile?.username
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </p>
          </div>
        )}
      </div>
      <div>
        <h2 className="font-bold text-lg">About me</h2>
        <p>{userProfile?.bio}</p>
      </div>
      <div className="flex gap-12">
        <h1
          className={`${
            showCoursesTaught
              ? "font-bold text-black underline"
              : "font-medium text-gray-600"
          } text-xl cursor-pointer`}
          onClick={toggleCoursesShown}
        >
          Courses Taught
        </h1>
        <h1
          className={`${
            !showCoursesTaught
              ? "font-bold text-black underline"
              : "font-medium text-gray-500"
          } text-xl cursor-pointer`}
          onClick={toggleCoursesShown}
        >
          Courses Taken
        </h1>
      </div>
      <div className="flex gap-4 flex-wrap">
        {courses?.map((course: Course) => {
          return <CourseHomeScreen course={course} />;
        })}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end gap-2">
          <p>
            <ChevronLeft
              cursor={previousPage ? "pointer" : "not-allowed"}
              opacity={previousPage ? "100%" : "50%"}
              onClick={() =>
                setCurrentPage((prevCurrentPage) =>
                  previousPage ? (prevCurrentPage -= 1) : prevCurrentPage
                )
              }
            />
          </p>
          <p>
            Page {total == 0 ? 0 : currentPage} of {Math.ceil(total / 10)}
          </p>
          <p>
            <ChevronRight
              cursor={nextPage ? "pointer" : "not-allowed"}
              opacity={nextPage ? "100%" : "50%"}
              onClick={() =>
                setCurrentPage((prevCurrentPage) =>
                  nextPage ? (prevCurrentPage += 1) : prevCurrentPage
                )
              }
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

import { Course, getCourses } from "@/services/courses.service";
import { useContext, useEffect, useState } from "react";
import CourseHomeScreen from "./CourseHomeScreen";
import { UserContext } from "@/context/UserContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Carousel1 from "@/assets/Carousel1.png";
import Carousel2 from "@/assets/Carousel2.png";
import Carousel3 from "@/assets/Carousel3.png";
import { Link } from "react-router-dom";
import CoursePreviewHome from "./CoursePreviewHome";
import CourseHomePageSkeleton from "../Skeleton/CourseHomePageSkeleton";
const HomePage = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { user } = userContext;
  const [courses1, setCourses1] = useState<Course[] | null>(null);
  const [courses2, setCourses2] = useState<Course[] | null>(null);
  const [courses3, setCourses3] = useState<Course[] | null>(null);
  const [courses4, setCourses4] = useState<Course[] | null>(null);
  const [courses1Loading, setCourses1Loading] = useState<boolean>(true);
  const [courses2Loading, setCourses2Loading] = useState<boolean>(true);
  const [courses3Loading, setCourses3Loading] = useState<boolean>(true);
  const [courses4Loading, setCourses4Loading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await getCourses(1, undefined, undefined, "Finance");
        setCourses1(response.results);
        setCourses1Loading(false);
      } catch (error) {
        console.log(error);
      }
    })();
    (async () => {
      try {
        const response = await getCourses(
          1,
          undefined,
          undefined,
          "Technology"
        );
        setCourses2(response.results);
        setCourses2Loading(false);
      } catch (error) {
        console.log(error);
      }
    })();
    (async () => {
      try {
        const response = await getCourses(
          1,
          undefined,
          undefined,
          "Self-Development"
        );
        setCourses3(response.results);
        setCourses3Loading(false);
      } catch (error) {
        console.log(error);
      }
    })();
    (async () => {
      try {
        const response = await getCourses(
          1,
          undefined,
          undefined,
          "Accounting"
        );
        setCourses4(response.results);
        setCourses4Loading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <div className="flex flex-col gap-10 px-4 xl:px-56 py-4">
      <div className="flex gap-4">
        {user && (
          <>
            {user?.profile_picture &&
            typeof user.profile_picture == "string" ? (
              <img
                src={user.profile_picture}
                alt="profile"
                className="rounded-full w-16 h-16 xl:w-14 xl:h-14"
              />
            ) : (
              <div className="bg-black rounded-full w-16 h-16 xl:w-14 xl:h-14 flex items-center justify-center">
                <p className="font-bold text-white text-xl">
                  {user?.username
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </p>
              </div>
            )}
          </>
        )}
        {user && (
          <div className="flex flex-col gap-1 justify-between ">
            <h1 className="font-bold text-lg xl:text-xl">
              {`Welcome Back ${user?.username}!`}
            </h1>
            <Link to="/profile">
              <p className="text-green-500 underline underline-offset-2 font-semibold text-xs">
                Edit Your Profile
              </p>
            </Link>
          </div>
        )}
      </div>
      <div className="px-4">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            <CarouselItem className="relative">
              {/* Image */}
              <img
                src={Carousel1}
                className="w-full sm:absolute sm:inset-0 sm:h-full sm:object-cover"
                alt="Carousel Image"
              />

              {/* Overlay content */}
              <div className="p-6 bg-white sm:absolute sm:w-1/3 sm:h-auto sm:shadow-lg sm:rounded-lg sm:top-1/2 sm:left-1/4 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 flex flex-col justify-start items-start space-y-4">
                <h1 className="text-xl sm:text-2xl font-bold font-serif">
                  Knowledge at your fingertips
                </h1>
                <p className="text-sm sm:text-md">
                  Learn from real-world experts from around the globe. Get
                  courses from S$14.98 through tomorrow.
                </p>
              </div>
            </CarouselItem>
            <CarouselItem className="relative">
              {/* Image */}
              <img
                src={Carousel2}
                className="w-full sm:absolute sm:inset-0 sm:h-full sm:object-cover"
                alt="Carousel Image"
              />

              {/* Overlay content */}
              <div className="p-6 bg-white border-black shadow-md sm:absolute sm:w-1/3 sm:h-auto sm:shadow-lg sm:rounded-lg sm:top-1/2 sm:left-1/4 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 flex flex-col justify-start items-start space-y-4">
                <h1 className="text-xl sm:text-2xl font-bold font-serif">
                  Invest in yourself
                </h1>
                <p className="text-sm sm:text-md">
                  Level up your career and who you are everyday all on one
                  platform.
                </p>
              </div>
            </CarouselItem>
            <CarouselItem className="relative">
              {/* Image */}
              <img
                src={Carousel3}
                className="w-full sm:inset-0 sm:h-full sm:object-cover"
                alt="Carousel Image"
              />
              <div className="p-6 bg-white sm:absolute sm:w-1/3 sm:h-auto sm:shadow-lg sm:rounded-lg sm:top-1/2 sm:left-1/4 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 flex flex-col justify-start items-start space-y-4">
                <h1 className="text-xl sm:text-2xl font-bold font-serif">
                  Learning that gets you
                </h1>
                <p className="text-sm sm:text-md">
                  Skills for your present (and your future). Get started with
                  us.
                </p>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="bg-black text-white" />
          <CarouselNext className="bg-black text-white" />
        </Carousel>
      </div>

      <h1 className="font-bold font-serif text-3xl">What To Learn Next</h1>
      <div>
        <div className="flex flex-col gap-2 px-4">
          <h1 className="font-bold text-xl ">Lets start learning</h1>
          <Carousel
            className="flex w-full h-72"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {courses1Loading ? (
                Array.from({ length: 5 }, (_, i) => i + 1).map(
                  (number: number) => {
                    return (
                      <CarouselItem className="basis-auto" key={number}>
                        <CourseHomePageSkeleton />
                      </CarouselItem>
                    );
                  }
                )
              ) : (
                <>
                  {courses1?.map((course: Course) => {
                    return (
                      <CarouselItem className="basis-auto flex" key={course.id}>
                        <CourseHomeScreen course={course} />
                      </CarouselItem>
                    );
                  })}
                </>
              )}
            </CarouselContent>
            <CarouselPrevious className="bg-black text-white -translate-y-12" />
            <CarouselNext className="bg-black text-white -translate-y-12" />
          </Carousel>
        </div>
        <div className="flex flex-col gap-2 px-4">
          <h1 className="font-bold text-xl ">Popular Courses</h1>
          <Carousel
            className="flex w-full h-72"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {courses2Loading ? (
                Array.from({ length: 5 }, (_, i) => i + 1).map(
                  (number: number) => {
                    return (
                      <CarouselItem className="basis-auto" key={number}>
                        <CourseHomePageSkeleton />
                      </CarouselItem>
                    );
                  }
                )
              ) : (
                <>
                  {courses2?.map((course: Course) => {
                    return (
                      <CarouselItem className="basis-auto flex" key={course.id}>
                        <CourseHomeScreen course={course} />
                      </CarouselItem>
                    );
                  })}
                </>
              )}
            </CarouselContent>
            <CarouselPrevious className="bg-black text-white -translate-y-12" />
            <CarouselNext className="bg-black text-white -translate-y-12" />
          </Carousel>
        </div>
        <div className="flex flex-col gap-2 px-4">
          <h1 className="font-bold text-xl ">Learners are Viewing</h1>
          <Carousel
            className="flex w-full h-72"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {courses3Loading ? (
                Array.from({ length: 5 }, (_, i) => i + 1).map(
                  (number: number) => {
                    return (
                      <CarouselItem className="basis-auto" key={number}>
                        <CourseHomePageSkeleton />
                      </CarouselItem>
                    );
                  }
                )
              ) : (
                <>
                  {courses3?.map((course: Course) => {
                    return (
                      <CarouselItem className="basis-auto" key={course.id}>
                        <CourseHomeScreen course={course} />
                      </CarouselItem>
                    );
                  })}
                </>
              )}
            </CarouselContent>
            <CarouselPrevious className="bg-black text-white -translate-y-12" />
            <CarouselNext className="bg-black text-white -translate-y-12" />
          </Carousel>
        </div>
        <div className="flex flex-col gap-2 px-4">
          <h1 className="font-bold text-xl ">Invest In Your Self!</h1>
          <Carousel
            className="flex w-full h-72"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {courses4Loading ? (
                Array.from({ length: 5 }, (_, i) => i + 1).map(
                  (number: number) => {
                    return (
                      <CarouselItem className="basis-auto" key={number}>
                        <CourseHomePageSkeleton />
                      </CarouselItem>
                    );
                  }
                )
              ) : (
                <>
                  {courses4?.map((course: Course) => {
                    return (
                      <CarouselItem className="basis-auto" key={course.id}>
                        <CourseHomeScreen course={course} />
                      </CarouselItem>
                    );
                  })}
                </>
              )}
            </CarouselContent>
            <CarouselPrevious className="bg-black text-white -translate-y-12" />
            <CarouselNext className="bg-black text-white -translate-y-12" />
          </Carousel>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-xl">Our top pick for you</h1>
          <CoursePreviewHome course={courses1 ? courses1[2] : null} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

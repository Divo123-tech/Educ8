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
import { Link } from "react-router-dom";
import CoursePreviewHome from "./CoursePreviewHome";

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

  useEffect(() => {
    (async () => {
      try {
        const response = await getCourses(1);
        setCourses1(response.results);
      } catch (error) {
        console.log(error);
      }
    })();
    (async () => {
      try {
        const response = await getCourses(1);
        setCourses2(response.results);
      } catch (error) {
        console.log(error);
      }
    })();
    (async () => {
      try {
        const response = await getCourses(1);
        setCourses3(response.results);
      } catch (error) {
        console.log(error);
      }
    })();
    (async () => {
      try {
        const response = await getCourses(1);
        setCourses4(response.results);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <div className="flex flex-col gap-10 px-4 lg:px-56 py-12">
      <div className="flex gap-4">
        {user && (
          <>
            {user?.profile_picture &&
            typeof user.profile_picture == "string" ? (
              <img
                src={import.meta.env.VITE_API_URL + user.profile_picture}
                alt="profile"
                className="rounded-full w-16 h-16"
              />
            ) : (
              <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center">
                <p className="font-bold text-white text-2xl">
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
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-2xl">
              {`Welcome Back ${user?.username}!`}
            </h1>
            <Link to="/profile">
              <p className="text-green-500 underline underline-offset-2 font-semibold text-sm">
                Edit Your Profile
              </p>
            </Link>
          </div>
        )}
      </div>
      <div className="px-4">
        <Carousel
          className="px-2 h-[200px] lg:h-[350px]"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            <CarouselItem>
              <img src={Carousel1} className="h-[200px] lg:h-[350px]"></img>
            </CarouselItem>
            <CarouselItem>
              <img src={Carousel1} className="h-[200px] lg:h-[350px]"></img>
            </CarouselItem>
            <CarouselItem>
              <img src={Carousel1} className="h-[200px] lg:h-[350px]"></img>
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
            <CarouselContent className="">
              {courses1?.map((course: Course) => {
                return (
                  <CarouselItem className="basis-auto">
                    <CourseHomeScreen course={course} key={course.id} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="bg-black text-white -translate-y-12" />
            <CarouselNext className="bg-black text-white -translate-y-12" />
          </Carousel>
        </div>
        <div className="flex flex-col gap-2 px-4">
          <h1 className="font-bold text-xl ">Popular Courses</h1>
          <Carousel
            className="flex w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="">
              {courses1?.map((course: Course) => {
                return (
                  <CarouselItem className="basis-auto">
                    <CourseHomeScreen course={course} key={course.id} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="bg-black text-white -translate-y-12" />
            <CarouselNext className="bg-black text-white -translate-y-12" />
          </Carousel>
        </div>
        <div className="flex flex-col gap-2 px-4">
          <h1 className="font-bold text-xl ">Learners are Viewing</h1>
          <Carousel
            className="flex w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="">
              {courses1?.map((course: Course) => {
                return (
                  <CarouselItem className="basis-auto">
                    <CourseHomeScreen course={course} key={course.id} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="bg-black text-white -translate-y-12" />
            <CarouselNext className="bg-black text-white -translate-y-12" />
          </Carousel>
        </div>
        <div className="flex flex-col gap-2 px-4">
          <h1 className="font-bold text-xl ">Invest In Your Self!</h1>
          <Carousel
            className="flex w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="">
              {courses1?.map((course: Course) => {
                return (
                  <CarouselItem className="basis-auto">
                    <CourseHomeScreen course={course} key={course.id} />
                  </CarouselItem>
                );
              })}
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

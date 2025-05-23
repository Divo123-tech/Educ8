import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Search, ChartColumnDecreasing } from "lucide-react";
import CreateCourseModal from "../CreateCourseModal";
import { Course, getCoursesTaught } from "@/services/courses.service";
import { UserContext } from "@/context/UserContext";
import CourseInstructorView from "../CourseInstructorView";
import { Link } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

const InstructorCourse = () => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { user } = userContext;
  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await getCoursesTaught(currentPage, searchInput);
      setCourses(response.results);
      setPreviousPage(response.previous);
      setNextPage(response.next);
      setTotal(response.count);
      setLoading(false);
    })();
  }, [user, nextPage, currentPage, previousPage, total, searchInput]);

  const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="flex flex-col px-8 lg:px-48 py-12 gap-8">
      <div>
        <h1 className="text-3xl font-bold font-serif">Courses</h1>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-8">
        <div className="flex items-center">
          <input
            placeholder="Search your courses"
            className="border border-black px-3 py-2 h-10 rounded-none focus:rounded-none"
            onChange={handleChangeSearchInput}
          ></input>
          <div className="bg-black text-white h-10 py-2 px-2">
            <Search className="text-sm" />
          </div>
        </div>
        <Link to="/dashboard">
          <button className="flex items-center gap-2 border border-black py-2 px-2 w-fit">
            <ChartColumnDecreasing />
            <p className="font-bold">Analytics Dashboard</p>
          </button>
        </Link>
        <div className="sm:ml-auto">
          <CreateCourseModal />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="ml-auto">
          <Pagination
            previousPage={previousPage}
            currentPage={currentPage}
            nextPage={nextPage}
            total={total}
            setCurrentPage={setCurrentPage}
          />
        </div>
        <div className="flex flex-col gap-8">
          {loading ? (
            Array.from({ length: 5 }, (_, i) => i + 1).map((number: number) => (
              <div
                className="flex gap-4 w-full border-b p-2 py-4 rounded-xl"
                key={number}
              >
                <Skeleton className="w-40 h-28 sm:w-28 sm:h-24 object-cover object-center pt-2 sm:pt-0" />
                <div className="flex flex-col justify-between w-full">
                  <Skeleton className="h-4 w-1/6" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : (
            <>
              {courses?.map((course: Course) => {
                return <CourseInstructorView course={course} key={course.id} />;
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourse;

import { Course, getCourses } from "@/services/courses.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CourseSearchView from "./CourseSearchView";
import Pagination from "../Pagination";

const SearchCourses = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const category = searchParams.get("category");
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    (async () => {
      const response = await getCourses(currentPage, searchQuery || "");
      setCourses(response.results);
      setPreviousPage(response.previous);
      setNextPage(response.next);
      setTotal(response.count);
      console.log(response.results);
    })();
  }, [currentPage, searchQuery]);
  return (
    <div className="px-48 py-12">
      {courses?.length != 0 ? (
        <div>
          <div>
            <h1 className="font-bold text-3xl">
              {total} results for "{searchQuery || category}"
            </h1>
          </div>

          <div className="px-16 flex flex-col gap-4">
            <div className="flex justify-end">
              <p className="text-gray-500 font-semibold">{total} results</p>
            </div>

            {courses?.map((course: Course) => {
              return <CourseSearchView key={course.id} course={course} />;
            })}
            {courses?.length != 0 && (
              <Pagination
                previousPage={previousPage}
                currentPage={currentPage}
                nextPage={nextPage}
                total={total}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <h1 className="font-bold text-2xl">
            Sorry, we couldn't find any results for "{searchQuery}"
          </h1>
          <p className="font-bold">
            Try adjusting your search. Here are some ideas:
          </p>
          <ul className="list-disc px-4">
            <li>Make sure all words are spelled correctly</li>
            <li>Try different search terms</li>
            <li>Try more general search terms</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchCourses;

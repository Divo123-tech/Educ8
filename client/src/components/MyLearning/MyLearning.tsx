import { getCoursesTaken, UserCourseItem } from "@/services/courses.service";
import { useEffect, useState } from "react";
import CourseHomeScreen from "../HomePage/CourseHomeScreen";
import { Search } from "lucide-react";
import Pagination from "../Pagination";

const MyLearning = () => {
  const [userCourses, setUserCourses] = useState<UserCourseItem[] | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  useEffect(() => {
    (async () => {
      const response = await getCoursesTaken(
        currentPage,
        searchInput,
        category
      );
      setUserCourses(response.results);
      setPreviousPage(response.previous);
      setNextPage(response.next);
      setTotal(response.count);
    })();
  }, [nextPage, currentPage, previousPage, total, searchInput, category]);

  const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className=" bg-[#1c1d1f] px-8 sm:px-16 md:px-32 xl:px-80 py-12">
        <h1 className="text-white font-bold text-4xl font-serif">
          My Learning
        </h1>
      </div>
      <div className="flex items-end pl-8 sm:pl-16 md:pl-32 xl:pl-80 pr-8 sm:pr-32 md:pr-48 xl:pr-96 gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm">Filter By</p>
          <select
            className="px-3 py-2 h-10 border border-black font-bold "
            onChange={handleChangeCategory}
          >
            <option value={""} selected>
              Categories
            </option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        <div className="flex items-center ml-auto">
          <input
            placeholder="Search your courses"
            className="border border-black px-3 py-2 h-10 rounded-none focus:rounded-none"
            onChange={handleChangeSearchInput}
          ></input>
          <div className="bg-black text-white h-10 py-2 px-2">
            <Search className="text-sm" />
          </div>
        </div>
      </div>
      <div className="px-8 sm:px-16 md:px-32 xl:px-80 flex gap-4 flex-wrap">
        {userCourses?.map((item: UserCourseItem) => {
          return (
            <CourseHomeScreen
              course={item.course}
              addedThumbnailLink={true}
              showAddToCart={false}
              preview={false}
            />
          );
        })}
      </div>
      <div className="flex justify-center">
        <Pagination
          previousPage={previousPage}
          currentPage={currentPage}
          nextPage={nextPage}
          total={total}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default MyLearning;

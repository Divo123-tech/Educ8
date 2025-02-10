import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type Props = {
  previousPage: string | null;
  currentPage: number;
  nextPage: string | null;
  total: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const Pagination = ({
  previousPage,
  nextPage,
  currentPage,
  total,
  setCurrentPage,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 py-4 items-center">
      <div className="flex justify-end gap-1 sm:gap-4 items-center">
        <div
          className={`border rounded-full border-black p-1 flex items-center ${
            !previousPage && "border-gray-400"
          }`}
        >
          <p>
            <ChevronLeft
              cursor={previousPage ? "pointer" : "not-allowed"}
              opacity={previousPage ? "100%" : "50%"}
              strokeWidth={1}
              onClick={() =>
                setCurrentPage((prevCurrentPage) =>
                  previousPage ? (prevCurrentPage -= 1) : prevCurrentPage
                )
              }
            />
          </p>
        </div>
        <p className="text-green-800 font-bold">
          Page {total == 0 ? 0 : currentPage} of {Math.ceil(total / 10)}
        </p>
        <div
          className={`border rounded-full border-black p-1 flex items-center ${
            !nextPage && "border-gray-400"
          }`}
        >
          <p>
            <ChevronRight
              cursor={nextPage ? "pointer" : "not-allowed"}
              opacity={nextPage ? "100%" : "50%"}
              strokeWidth={1}
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

export default Pagination;

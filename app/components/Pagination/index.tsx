import { useState } from "react";
import { useSearchParams, useSubmit } from "react-router-dom";

type Props = {
  totalPages: number;
};

const Pagination = ({ totalPages }: Props) => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const submit = useSubmit();

  return (
    <div className="flex items-start justify-center pb-6">
      <div className="btn-group">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1;
          return (
            <button
              type="button"
              key={"pagination" + i}
              className={`btn ${currentPage === pageNumber && "btn-active"}`}
              onClick={() => {
                searchParams.set("pageNumber", pageNumber.toString());
                submit(searchParams, { method: "GET" });
                setCurrentPage(pageNumber);
              }}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Pagination;

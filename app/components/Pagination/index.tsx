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
    <>
      {totalPages > 0 && (
        <div className="flex items-start justify-center py-3">
          <div className="btn-group">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  type="button"
                  key={"pagination" + i}
                  className={`btn-sm border border-brand-black/20 ${
                    currentPage === pageNumber && "btn-active"
                  }`}
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
      )}
    </>
  );
};

export default Pagination;

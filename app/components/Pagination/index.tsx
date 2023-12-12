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
        <div className="flex flex-row items-start justify-center gap-1 pb-3 pt-6">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                type="button"
                key={"pagination" + i}
                className={`flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-brand-white hover:bg-primary-dark ${
                  currentPage === pageNumber && "bg-primary-dark"
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
      )}
    </>
  );
};

export default Pagination;

import { useState } from "react";
import { useSearchParams, useSubmit } from "react-router-dom";

type Props = {
  totalPages: number;
};

const Pagination = ({ totalPages }: Props) => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const submit = useSubmit();

  const renderPageButton = (pageNumber: number) => {
    return (
      <button
        type="button"
        key={`pagination-${pageNumber}`}
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
  };

  return (
    <>
      {totalPages > 0 && (
        <div className="flex flex-row items-start justify-center gap-1 pb-3 pt-6">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;

            // Show only up to 6 pages
            if (currentPage <= 3 && pageNumber <= 3) {
              return renderPageButton(pageNumber);
            } else if (currentPage > 3 && currentPage <= totalPages - 3) {
              if (pageNumber === 1 || pageNumber === totalPages) {
                // Show first and last pages
                return renderPageButton(pageNumber);
              } else if (
                Math.abs(pageNumber - currentPage) <= 1 ||
                pageNumber === totalPages - 1
              ) {
                // Show current page and neighboring pages
                return renderPageButton(pageNumber);
              } else if (pageNumber === totalPages - 2) {
                // Show ellipsis before the last page
                return (
                  <span key={`ellipsis-end` + i} className="mx-1">
                    ...
                  </span>
                );
              }
            } else {
              // Show last 6 pages
              if (pageNumber > totalPages - 3) {
                return renderPageButton(pageNumber);
              } else if (pageNumber === totalPages - 4) {
                // Show ellipsis before the last 6 pages
                return (
                  <span key={`ellipsis-start` + i} className="mx-1">
                    ...
                  </span>
                );
              }
            }

            return null;
          })}
        </div>
      )}
    </>
  );
};

export default Pagination;

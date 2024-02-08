import { IoPlaySharp, IoPlaySkipForwardSharp } from "react-icons/io5";
import { useSearchParams, useSubmit } from "react-router-dom";

type Props = {
  totalPages: number;
  pagesToShow?: number;
};

const Pagination = ({ totalPages, pagesToShow = 8 }: Props) => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber"));
  const submit = useSubmit();

  const goToPage = (pageNumber: number) => {
    searchParams.set("pageNumber", pageNumber.toString());
    submit(searchParams, { method: "GET" });
  };

  const renderPageButton = (pageNumber: number) => (
    <button
      type="button"
      key={`pagination-${pageNumber}`}
      className={`flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-brand-white hover:bg-primary-dark ${
        currentPage === pageNumber && "bg-primary-dark"
      }`}
      onClick={() => goToPage(pageNumber)}
    >
      {pageNumber}
    </button>
  );

  let startPage = 1;
  if (currentPage > 5 && totalPages > 10) {
    startPage = Math.min(currentPage - 4, totalPages - 9);
  }

  return (
    <>
      {totalPages > 0 && (
        <div className="flex flex-row items-start justify-center gap-1 pb-3 pt-6">
          {/* TO START BUTTON */}
          {totalPages > pagesToShow &&
            currentPage > Math.ceil(totalPages / 3) && (
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-brand-white hover:bg-primary-dark -scale-x-100"
                onClick={() => goToPage(1)}
              >
                <IoPlaySkipForwardSharp />
              </button>
            )}

          {/* BACK BUTTON */}
          {totalPages > pagesToShow && currentPage > 1 && (
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-brand-white hover:bg-primary-dark -scale-x-100"
              onClick={() => goToPage(currentPage - 1)}
            >
              <IoPlaySharp />
            </button>
          )}

          {/* PAGES */}
          {Array.from({ length: Math.min(totalPages, pagesToShow) }).map(
            (_, i) => {
              const pageNumber = startPage + i;
              return renderPageButton(pageNumber);
            },
          )}

          {/* NEXT BUTTON */}
          {totalPages > pagesToShow && currentPage < totalPages && (
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-brand-white hover:bg-primary-dark"
              onClick={() => goToPage(currentPage + 1)}
            >
              <IoPlaySharp />
            </button>
          )}

          {/* TO END BUTTON */}
          {totalPages > pagesToShow &&
            currentPage < Math.ceil(totalPages / 3) && (
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-brand-white hover:bg-primary-dark"
                onClick={() => goToPage(totalPages)}
              >
                <IoPlaySkipForwardSharp />
              </button>
            )}
        </div>
      )}
    </>
  );
};

export default Pagination;

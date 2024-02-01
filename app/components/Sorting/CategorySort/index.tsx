import { useLocation, useSearchParams, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { IoTrendingDown, IoTrendingUp } from "react-icons/io5";

type Props = {
  totalCount?: number;
};

const CategorySort = ({ totalCount }: Props) => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const submit = useSubmit();

  const [sortAsc, setSortAsc] = useState<boolean>(true);

  return (
    <div className="mb-3 flex max-w-full items-center justify-between gap-3 px-3 text-brand-black/50">
      {totalCount ? (
        <p className="text-sm">{totalCount} items found</p>
      ) : (
        <p className="text-sm">no items found.</p>
      )}
      <div className="flex gap-3">
        <select
          className="select select-xs !h-[24px] !min-h-[24px] w-28 border border-brand-black/20 bg-base-100"
          onChange={(e) => {
            searchParams.set("sortBy", e.target.value);
            const sortOrder = searchParams.get("sortOrder");
            searchParams.set("sortOrder", sortOrder || "asc");
            submit(searchParams, {
              method: "GET",
              action: pathname,
            });
          }}
        >
          <option value="name">Name</option>
          <option value="index">Index</option>
        </select>

        {sortAsc && (
          <button
            type="button"
            className="flex h-[24px] cursor-pointer select-none items-center gap-1 border border-brand-black/20 bg-base-100 fill-current px-3"
            onClick={() => {
              if (sortAsc) {
                const sortBy = searchParams.get("sortBy");
                if (!sortBy) {
                  searchParams.set("sortBy", "name");
                }

                setSortAsc(!sortAsc);
                searchParams.set("sortOrder", "desc");
                submit(searchParams, {
                  method: "GET",
                  action: pathname,
                });
              }
            }}
          >
            <IoTrendingUp size={20} />
            <p className="text-xs">Asc</p>
          </button>
        )}
        {!sortAsc && (
          <button
            type="button"
            className="flex h-[24px] cursor-pointer select-none items-center gap-1 border border-brand-black/20 bg-base-100 fill-current px-3"
            onClick={() => {
              if (!sortAsc) {
                const sortBy = searchParams.get("sortBy");
                if (!sortBy) {
                  searchParams.set("sortBy", "popular");
                }

                setSortAsc(!sortAsc);
                searchParams.set("sortOrder", "asc");
                submit(searchParams, {
                  method: "GET",
                  action: pathname,
                });
              }
            }}
          >
            <IoTrendingDown size={20} />
            <p className="text-xs">Desc</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default CategorySort;

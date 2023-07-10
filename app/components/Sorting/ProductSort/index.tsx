import { useLocation, useSearchParams, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { IoTrendingDown, IoTrendingUp } from "react-icons/io5";

const ProductSort = () => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const submit = useSubmit();

  const [sortAsc, setSortAsc] = useState<boolean>(true);

  return (
    <div className="flex items-center justify-end gap-3">
      <select
        className=" select select-xs w-full max-w-[10rem] bg-base-300"
        onChange={(e) => {
          searchParams.set("sortBy", e.target.value);
          const sortOrder = searchParams.get("sortOrder");
          searchParams.set("sortOrder", sortOrder || "desc");
          submit(searchParams, {
            method: "GET",
            action: pathname,
          });
        }}
      >
        <option value="totalSold">Popular</option>
        <option value="createdAt">New</option>
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>

      {sortAsc && (
        <div
          className="flex h-[24px] cursor-pointer select-none items-center gap-1 bg-base-300 fill-current px-3"
          onClick={() => {
            if (sortAsc) {
              const sortBy = searchParams.get("sortBy");
              if (!sortBy) {
                searchParams.set("sortBy", "popular");
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
        </div>
      )}
      {!sortAsc && (
        <div
          className="flex h-[24px] cursor-pointer select-none items-center gap-1 bg-base-300 fill-current px-3"
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
        </div>
      )}
    </div>
  );
};

export default ProductSort;

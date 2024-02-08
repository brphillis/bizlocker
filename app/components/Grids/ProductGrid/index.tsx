import React, { useEffect, useState } from "react";
import { IoShirtSharp } from "react-icons/io5";
import { useNavigate } from "@remix-run/react";
import Pagination from "~/components/Pagination";
import { ProductWithDetails } from "~/models/Products/types";
import ProductCard from "../../Cards/ProductCard";
import Divider from "~/components/Filter/ProductFilterSideBar/Divider";

type Props = {
  columns?: string;
  columnsMobile?: string;
  enablePlaceHolder?: boolean;
  extendStyle?: string;
  products: ProductWithDetails[];
  totalPages?: number;
};

const ProductGrid = ({
  columns,
  columnsMobile,
  enablePlaceHolder,
  extendStyle,
  products,
  totalPages,
}: Props) => {
  const navigate = useNavigate();
  const [showPlaceHolder, setShowPlaceHolder] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = (
      event: MediaQueryListEvent | MediaQueryListEventInit,
    ) => {
      setShowPlaceHolder(event.matches as boolean);
    };

    if (!(products.length % 2 == 0)) {
      handleResize(mediaQuery);
      mediaQuery.addEventListener("change", handleResize);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, [products.length]);

  return (
    <div className={`w-full px-0 max-lg:px-3 ${extendStyle}`}>
      <div
        className={`relative grid justify-items-center gap-3 max-md:gap-y-3 max-lg:!grid-cols-4 max-md:!grid-cols-3 max-sm:!grid-cols-2 md:gap-6 gap-y-6 
        ${columns || "grid-cols-4"} ${columnsMobile || "max-md:grid-cols-2"}`}
      >
        {products?.map((product, i: number) => (
          <React.Fragment key={"productCard_" + product?.id + i}>
            <ProductCard {...product} />
          </React.Fragment>
        ))}

        {enablePlaceHolder && showPlaceHolder && (
          <button
            type="button"
            className="group flex w-full flex-col overflow-hidden bg-brand-white"
            onClick={() =>
              navigate({
                pathname: "/products",
                search: `?productSubCategory=${products?.[0].productSubCategories?.[0].name}`,
              })
            }
          >
            <div className="relative flex max-sm:h-60 max-md:h-[300px] h-72  w-full max-w-full cursor-pointer items-center justify-center overflow-hidden bg-gradient-to-tr from-brand-black/25 to-brand-white/50">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="rounded-full bg-brand-black/50 p-2">
                  <IoShirtSharp size={22} className="text-brand-white" />
                </div>
                <p className="text-md font-bold tracking-wide text-brand-black/50">
                  See more
                </p>
              </div>
            </div>
          </button>
        )}
      </div>

      {totalPages && totalPages > 1 && (
        <>
          <Divider color="black" extendStyle="pt-6 mb-0" />
          <Pagination totalPages={totalPages} />
        </>
      )}
    </div>
  );
};

export default ProductGrid;

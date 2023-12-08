import React, { useEffect, useState } from "react";
import ProductCard from "../../Cards/ProductCard";
import Pagination from "~/components/Pagination";
import { IoShirtSharp } from "react-icons/io5";
import { useNavigate } from "@remix-run/react";

type Props = {
  products: Product[];
  totalPages?: number;
  cols?: number;
  enablePlaceHolder?: boolean;
};

const ProductGrid = ({
  products,
  totalPages,
  cols,
  enablePlaceHolder,
}: Props) => {
  const navigate = useNavigate();
  const [showPlaceHolder, setShowPlaceHolder] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = (
      event: MediaQueryListEvent | MediaQueryListEventInit
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
    <div className="w-full">
      <div
        style={{
          gridTemplateColumns: cols
            ? `repeat(${cols}, minmax(0, 1fr))`
            : "repeat(4, minmax(0, 1fr))",
        }}
        className="relative grid justify-items-center gap-3 gap-y-3 px-3 max-lg:!grid-cols-4 max-md:!grid-cols-3 max-sm:!grid-cols-2 md:gap-6 md:gap-y-6 xl:px-0"
      >
        {products?.map((product) => (
          <React.Fragment key={"productCard_" + product.id}>
            <ProductCard {...product} />
          </React.Fragment>
        ))}

        {enablePlaceHolder && showPlaceHolder && (
          <div
            className="group flex w-full flex-col overflow-hidden bg-brand-white"
            onClick={() =>
              navigate({
                pathname: "/products",
                search: `?productSubCategory=${products?.[0].productSubCategories?.[0].name}`,
              })
            }
          >
            <div className="relative flex h-60 w-full max-w-full cursor-pointer items-center justify-center overflow-hidden bg-gradient-to-tr from-brand-black/25 to-brand-white/50 sm:h-72">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="rounded-full bg-brand-black/50 p-2">
                  <IoShirtSharp size={22} className="text-brand-white" />
                </div>
                <p className="text-md font-bold tracking-wide text-brand-black/50">
                  See more
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {totalPages && <Pagination totalPages={totalPages} />}
    </div>
  );
};

export default ProductGrid;

import { useLoaderData } from "@remix-run/react";
import ProductGrid from "~/components/Grids/ProductGrid";
import ProductSort from "~/components/Sorting/ProductSort";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";
import PromotionBanner from "~/components/Banners/PromotionBanner";
import { productsLoader } from "~/modules/Website/Products/index.server";
import ProductFilterSideBar from "~/components/Filter/ProductFilterSideBar";

const Products = () => {
  const {
    promotion,
    products,
    totalPages,
    departments,
    productCategories,
    productSubCategories,
    brands,
    colors,
  } = useLoaderData<typeof productsLoader>();

  return (
    <PageWrapper>
      <>
        {promotion?.bannerImage && (
          <PromotionBanner
            name={promotion.name}
            bannerImage={promotion.bannerImage}
            targetGender={promotion.targetGender}
          />
        )}
      </>

      <div className="w-[1280px] max-w-[100vw]">
        <ProductSort
          totalCount={(products && products?.length * totalPages) || 0}
        />
        <div className="my-3 w-full border-b border-brand-black/20" />

        <div className="flex w-full flex-wrap items-start justify-center gap-6 px-0 sm:w-full xl:flex-nowrap">
          <ProductFilterSideBar
            departments={departments}
            productCategories={productCategories}
            productSubCategories={productSubCategories}
            brands={brands}
            colors={colors}
          />

          {products && products?.length > 0 && (
            <ProductGrid products={products} totalPages={totalPages} />
          )}
          {!products ||
            (products.length === 0 && (
              <div className="w-[968px] max-w-full pl-3">No results.</div>
            ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Products;

import { useLoaderData } from "@remix-run/react";
import { addToCart } from "~/models/cart.server";
import { getBrands } from "~/models/brands.server";
import ProductGrid from "~/components/Grids/ProductGrid";
import { searchProducts } from "~/models/products.server";
import { getPromotion } from "~/models/promotions.server";
import ProductSort from "~/components/Sorting/ProductSort";
import { getAvailableColors } from "~/models/enums.server";
import { getDepartments } from "~/models/departments.server";
import PromotionBanner from "~/components/Banners/PromotionBanner";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import { getProductCategories } from "~/models/productCategories.server";
import ProductFilterSideBar from "~/components/Filter/ProductFilterSideBar";
import { getProductSubCategories } from "~/models/productSubCategories.server";

import {
  json,
  redirect,
  type ActionArgs,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/node";

export const meta: V2_MetaFunction = ({ data }) => {
  return [
    { title: data.promotionName },
    {
      name: "description",
      content: data.promotionName,
    },
  ];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const promotion = await getPromotion(undefined, params.name);

  if (!promotion) {
    return redirect(request?.referrer);
  }

  const formData = new FormData();
  formData.set("promotionId", promotion.id.toString());

  const { products, totalPages } = await searchProducts(
    Object.fromEntries(formData),
    url,
    true
  );

  if (!promotion?.isActive) {
    return redirect(request?.referrer);
  }

  const departments = await getDepartments();
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  return json({
    promotion,
    products,
    totalPages,
    departments,
    productCategories,
    productSubCategories,
    brands,
    colors,
  });
};

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());
  const { variantId, quantity } = form;
  switch (form._action) {
    default:
      return await addToCart(request, variantId as string, quantity as string);
  }
};

const Promotion = () => {
  const {
    promotion,
    products,
    totalPages,
    departments,
    productCategories,
    productSubCategories,
    brands,
    colors,
  } = useLoaderData<typeof loader>();

  return (
    <PageWrapper>
      {promotion.bannerImage && (
        <PromotionBanner
          name={promotion.name}
          bannerImage={promotion.bannerImage}
          targetGender={promotion.targetGender}
        />
      )}

      <div className="w-[1280px] max-w-full">
        <ProductSort
          totalCount={(products && products?.length * totalPages) || 0}
        />
        <div className="my-3 w-full border-b border-brand-black/20" />

        <div className="flex flex-wrap items-start justify-center gap-6 px-0 sm:w-full xl:flex-nowrap">
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

export default Promotion;

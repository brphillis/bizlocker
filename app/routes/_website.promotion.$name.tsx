import {
  type LoaderArgs,
  type ActionArgs,
  redirect,
} from "@remix-run/server-runtime";
import { useLoaderData } from "react-router-dom";
import PromotionBanner from "~/components/Banners/PromotionBanner";
import ProductFilterSideBar from "~/components/Filter/ProductFilterSideBar";
import ProductGrid from "~/components/Grids/ProductGrid";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import ProductSort from "~/components/Sorting/ProductSort";
import { getBrands } from "~/models/brands.server";
import { addToCart } from "~/models/cart.server";
import { getAvailableColors } from "~/models/enums.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import { searchProducts } from "~/models/products.server";
import { getPromotion } from "~/models/promotions.server";
import { getProductCategories } from "~/models/productCategories.server";
import type { V2_MetaFunction } from "@remix-run/node";
import { getDepartments } from "~/models/departments.server";

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

  if (promotion) {
    const formData = new FormData();
    formData.set("promotionId", promotion.id.toString());
    const { products, totalPages } = await searchProducts(
      Object.fromEntries(formData),
      url,
      true
    );
    if (promotion?.isActive) {
      const departments = await getDepartments();
      const productCategories = await getProductCategories();
      const productSubCategories = await getProductSubCategories();
      const brands = await getBrands();
      const colors = await getAvailableColors();
      const promotionName = promotion.name;

      return {
        promotion,
        promotionName,
        products,
        totalPages,
        departments,
        productCategories,
        productSubCategories,
        brands,
        colors,
      };
    } else redirect(request?.referrer);
  } else return redirect(request?.referrer);
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
  } =
    (useLoaderData() as {
      promotion: Promotion;
      products: Product[];
      totalPages: number;
      departments: Department[];
      productCategories: ProductCategory[];
      productSubCategories: ProductSubCategory[];
      brands: Brand[];
      colors: string[];
    }) || {};

  return (
    <PageWrapper>
      <PromotionBanner promotion={promotion} />
      <div className="w-[1280px] max-w-full">
        <ProductSort totalCount={products.length * totalPages} />
        <div className="my-3 w-full border-b border-brand-black/20" />

        <div className="flex flex-wrap items-start justify-center gap-6 px-0 sm:w-full xl:flex-nowrap">
          <ProductFilterSideBar
            departments={departments}
            productCategories={productCategories}
            productSubCategories={productSubCategories}
            brands={brands}
            colors={colors}
          />
          {products?.length > 0 && (
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

import {
  type LoaderArgs,
  type ActionArgs,
  redirect,
} from "@remix-run/server-runtime";
import { useLoaderData } from "react-router-dom";
import PromotionBanner from "~/components/Banners/PromotionBanner";
import ProductFilterSideBar from "~/components/Filter/ProductFilterSideBar";
import ProductGrid from "~/components/Grids/ProductGrid";
import PageWrapper from "~/components/Layout/PageWrapper";
import ProductSort from "~/components/Sorting/ProductSort";
import { getBrands } from "~/models/brands.server";
import { addToCart } from "~/models/cart.server";
import { getAvailableColors } from "~/models/enums.server";
import { getProductCategories } from "~/models/productCategories.server";
import { searchProducts } from "~/models/products.server";
import { getPromotion } from "~/models/promotions.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const promotion = await getPromotion(undefined, params.name);

  if (promotion) {
    const formData = new FormData();
    formData.set("promotionId", promotion.id.toString());
    const { products, totalPages } = await searchProducts(
      Object.fromEntries(formData),
      url
    );
    if (promotion?.isActive) {
      const productCategories = await getProductCategories();
      const brands = await getBrands();
      const colors = await getAvailableColors();

      return {
        promotion,
        products,
        totalPages,
        productCategories,
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
  const { promotion, products, totalPages, productCategories, brands, colors } =
    (useLoaderData() as {
      promotion: Promotion;
      products: Product[];
      totalPages: number;
      productCategories: ProductCategory[];
      brands: Brand[];
      colors: string[];
    }) || {};

  return (
    <PageWrapper>
      <PromotionBanner promotion={promotion} />
      <div className="w-[1280px] max-w-[100vw]">
        <ProductSort totalCount={products.length * totalPages} />
        <div className="my-3 w-full border-b border-brand-black/20" />

        <div className="flex w-screen items-start justify-center gap-6 px-0 py-3 sm:w-full">
          <ProductFilterSideBar
            productCategories={productCategories}
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

import {
  type LoaderArgs,
  type ActionArgs,
  redirect,
} from "@remix-run/server-runtime";
import { useLoaderData } from "react-router-dom";
import PromotionBanner from "~/components/Banners/PromotionBanner";
import ProductGrid from "~/components/Grids/ProductGrid";
import PageWrapper from "~/components/Layout/PageWrapper";
import Pagination from "~/components/Pagination";
import { addToCart } from "~/models/cart.server";
import { searchProducts } from "~/models/products.server";
import { getPromotion } from "~/models/promotions.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request?.url);
  const promotionName = params.name;

  const searchQuery = {
    promotion: promotionName,
    gender: (url.searchParams.get("gender") as string) || undefined,
    sortBy: (url.searchParams.get("sortBy") as SortBy) || undefined,
    sortOrder: (url.searchParams.get("sortOrder") as SortOrder) || undefined,
    page: Number(url?.searchParams.get("pageNumber")) || 1,
    perPage: Number(url?.searchParams.get("itemsPerPage")) || 10,
  };

  if (promotionName) {
    const { products, totalPages } = await searchProducts(searchQuery);

    //we get the promotion related to the products fetched with the promotion name to ensure they match
    if (products && products[0]?.promotionId) {
      const promotion = await getPromotion(products[0].promotionId.toString());

      if (promotion?.isActive) {
        return { promotion, products, totalPages };
      }
    } else return redirect(request?.referrer);
  } else return null;
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
  const { promotion, products, totalPages } =
    (useLoaderData() as {
      promotion: Promotion;
      products: Product[];
      totalPages: number;
    }) || {};

  return (
    <PageWrapper>
      <PromotionBanner promotion={promotion} />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </PageWrapper>
  );
};

export default Promotion;

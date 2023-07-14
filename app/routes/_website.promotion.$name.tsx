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
import { getPromotion } from "~/models/promotions.server";
import { productSearchParams } from "~/utility/actionHelpers";

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request?.url);
  const promotionName = params.name;

  if (promotionName) {
    const { products, totalPages } = await productSearchParams(url);

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

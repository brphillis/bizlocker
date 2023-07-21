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
  const promotion = await getPromotion(undefined, params.name);

  if (promotion) {
    const formData = new FormData();
    formData.set("promotionId", promotion.id.toString());
    const { products, totalPages } = await searchProducts(
      Object.fromEntries(formData)
    );

    if (promotion?.isActive) {
      return { promotion, products, totalPages };
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
  const { promotion, products, totalPages } =
    (useLoaderData() as {
      promotion: Promotion;
      products: Product[];
      totalPages: number;
    }) || {};

  return (
    <PageWrapper>
      <PromotionBanner promotion={promotion} />
      <ProductGrid
        products={products}
        totalCount={products.length * totalPages}
      />
      <Pagination totalPages={totalPages} />
    </PageWrapper>
  );
};

export default Promotion;

import {
  redirect,
  type LoaderArgs,
  type ActionArgs,
} from "@remix-run/server-runtime";
import { useLoaderData } from "react-router-dom";
import { tokenAuth } from "~/auth.server";
import BannerBlock from "~/components/Blocks/BannerBlock";
import ProductGrid from "~/components/Grids/ProductGrid";
import PageWrapper from "~/components/Layout/PageWrapper";
import Pagination from "~/components/Pagination";
import { getRandomCampaign } from "~/models/campaigns.server";
import { addToCart } from "~/models/cart.server";
import { searchProducts } from "~/models/products.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const productCategory = url.searchParams.get("productCategory")?.toString();
  const campaign = await getRandomCampaign(productCategory);

  const { products, totalPages } = await searchProducts(undefined, url);

  return { products, totalPages, campaign };
};

export const action = async ({ request }: ActionArgs) => {
  const authenticated = await tokenAuth(request);
  if (!authenticated.valid) {
    return redirect("/login");
  }
  const form = Object.fromEntries(await request.formData());
  const { variantId, quantity } = form;
  switch (form._action) {
    default:
      return await addToCart(request, variantId as string, quantity as string);
  }
};

const Products = () => {
  const { products, totalPages, campaign } = useLoaderData() as {
    products: Product[];
    totalPages: number;
    campaign: Campaign;
  };

  return (
    <PageWrapper>
      {campaign && <BannerBlock image={campaign?.bannerImage} />}
      <ProductGrid
        products={products}
        totalCount={products.length * totalPages}
      />
      <Pagination totalPages={totalPages} />
    </PageWrapper>
  );
};

export default Products;

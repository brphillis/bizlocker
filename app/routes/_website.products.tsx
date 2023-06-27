import {
  redirect,
  type LoaderArgs,
  type ActionArgs,
} from "@remix-run/server-runtime";
import { useLoaderData } from "react-router-dom";
import { tokenAuth } from "~/auth.server";
import ProductGrid from "~/components/Blocks/ProductGrid";
import PageWrapper from "~/components/Layout/PageWrapper";
import Pagination from "~/components/Pagination";
import { addToCart } from "~/models/cart.server";
import { searchProducts } from "~/models/products.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const searchQuery = {
    name: url.searchParams.get("name")?.toString() || undefined,
    rootCategory: url.searchParams.get("rootCategory")?.toString() || undefined,
    category: url.searchParams.get("productCategory")?.toString() || undefined,
    brand: url.searchParams.get("brand")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("itemsPerPage")) || 10,
  };

  const { products, totalPages } = await searchProducts(searchQuery);
  return { products, totalPages };
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
  const { products, totalPages } = useLoaderData() as {
    products: Product[];
    totalPages: number;
  };

  return (
    <PageWrapper>
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </PageWrapper>
  );
};

export default Products;

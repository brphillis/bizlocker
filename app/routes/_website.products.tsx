import {
  redirect,
  type LoaderArgs,
  type ActionArgs,
} from "@remix-run/server-runtime";
import { useLoaderData } from "react-router-dom";
import { tokenAuth } from "~/auth.server";
import BannerBlock from "~/components/Blocks/BannerBlock";
import ProductFilterSideBar from "~/components/Filter/ProductFilterSideBar";
import ProductGrid from "~/components/Grids/ProductGrid";
import PageWrapper from "~/components/Layout/PageWrapper";
import ProductSort from "~/components/Sorting/ProductSort";
import { getBrands } from "~/models/brands.server";
import { getRandomCampaign } from "~/models/campaigns.server";
import { addToCart } from "~/models/cart.server";
import { getAvailableColors } from "~/models/enums.server";
import { getProductCategories } from "~/models/productCategories.server";
import { searchProducts } from "~/models/products.server";
import { getRootCategories } from "~/models/rootCategories.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const { products, totalPages } = await searchProducts(undefined, url);
  const rootCategories = await getRootCategories();
  const productCategories = await getProductCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  const productCategory = url.searchParams.get("productCategory")?.toString();
  const campaign = await getRandomCampaign(productCategory);

  return {
    campaign,
    products,
    totalPages,
    rootCategories,
    productCategories,
    brands,
    colors,
  };
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
  const {
    campaign,
    products,
    totalPages,
    rootCategories,
    productCategories,
    brands,
    colors,
  } = useLoaderData() as {
    campaign: Campaign;
    products: Product[];
    totalPages: number;
    rootCategories: RootCategory[];
    productCategories: ProductCategory[];
    brands: Brand[];
    colors: string[];
  };

  return (
    <PageWrapper>
      {campaign && <BannerBlock image={campaign?.bannerImage} />}

      <div className="w-[1280px] max-w-[100vw]">
        <ProductSort totalCount={products.length * totalPages} />
        <div className="my-3 w-full border-b border-brand-black/20" />

        <div className="flex w-screen flex-wrap items-start justify-center gap-3 px-0 sm:w-full xl:flex-nowrap">
          <ProductFilterSideBar
            rootCategories={rootCategories}
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

export default Products;

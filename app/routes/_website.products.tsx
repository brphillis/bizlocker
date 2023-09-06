import {
  redirect,
  type LoaderArgs,
  type ActionArgs,
} from "@remix-run/server-runtime";
import { useLoaderData } from "react-router-dom";
import { tokenAuth } from "~/auth.server";
// import BannerBlock from "~/components/Blocks/BannerBlock";
import ProductFilterSideBar from "~/components/Filter/ProductFilterSideBar";
import ProductGrid from "~/components/Grids/ProductGrid";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import ProductSort from "~/components/Sorting/ProductSort";
import { getBrands } from "~/models/brands.server";
import { getRandomCampaign } from "~/models/campaigns.server";
import { addToCart } from "~/models/cart.server";
import { getAvailableColors } from "~/models/enums.server";
import { getProductCategories } from "~/models/productCategories.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import { searchProducts } from "~/models/products.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const { products, totalPages } = await searchProducts(undefined, url);
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  const productSubCategory = url.searchParams
    .get("productSubCategory")
    ?.toString();
  const campaign = await getRandomCampaign(productSubCategory);

  return {
    campaign,
    products,
    totalPages,
    productCategories,
    productSubCategories,
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
    // campaign,
    products,
    totalPages,
    productCategories,
    productSubCategories,
    brands,
    colors,
  } = useLoaderData() as {
    campaign: Campaign;
    products: Product[];
    totalPages: number;
    productCategories: ProductCategory[];
    productSubCategories: ProductSubCategory[];
    brands: Brand[];
    colors: string[];
  };

  return (
    <PageWrapper>
      {/* {campaign && <BannerBlock content={campaign?.bannerImage as Image} />} */}

      <div className="w-[1280px] max-w-[100vw]">
        <ProductSort totalCount={products.length * totalPages} />
        <div className="my-3 w-full border-b border-brand-black/20" />

        <div className="flex w-full flex-wrap items-start justify-center gap-3 px-0 sm:w-full xl:flex-nowrap">
          <ProductFilterSideBar
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

export default Products;

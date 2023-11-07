import type { V2_MetaFunction } from "@remix-run/node";
import {
  type LoaderArgs,
  type ActionArgs,
  redirect,
} from "@remix-run/server-runtime";
import { useLoaderData } from "react-router-dom";
import { tokenAuth } from "~/auth.server";
import BannerBlock from "~/components/Blocks/BannerBlock";
import ProductFilterSideBar from "~/components/Filter/ProductFilterSideBar";
import ProductGrid from "~/components/Grids/ProductGrid";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import ProductSort from "~/components/Sorting/ProductSort";
import { getBrands } from "~/models/brands.server";
import { getRandomCampaignOrPromotion } from "~/models/campaigns.server";
import { addToCart } from "~/models/cart.server";
import { getDepartments } from "~/models/departments.server";
import { getAvailableColors } from "~/models/enums.server";
import { getProductCategories } from "~/models/productCategories.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import { searchProducts } from "~/models/products.server";

export const meta: V2_MetaFunction = ({ data }) => {
  const url = new URL(data.url);
  const paramsArray = Array.from(url.searchParams.entries());
  const specificParam = paramsArray[paramsArray.length - 1];
  return [
    {
      title:
        "CLUTCH Clothing | " +
        (specificParam?.[1] ? specificParam?.[1] : "Products"),
    },
    {
      name: "description",
      content:
        "Shopping at CLUTCH clothing not only ensures the best quality fashion in Australia but we also have all the latest " +
        (specificParam?.[1] ? specificParam?.[1] : "products") +
        " in stock today available to be shipped straight to your door.",
    },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const { products, totalPages } = await searchProducts(undefined, url, true);
  const departments = await getDepartments();
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  const productSubCategory = url.searchParams
    .get("productSubCategory")
    ?.toString();
  const { campaign, promotion } =
    ((await getRandomCampaignOrPromotion(productSubCategory)) as {
      campaign: Campaign;
      promotion: Promotion;
    }) || {};

  return {
    campaign,
    promotion,
    products,
    totalPages,
    departments,
    productCategories,
    productSubCategories,
    brands,
    colors,
    url,
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
    promotion,
    products,
    totalPages,
    departments,
    productCategories,
    productSubCategories,
    brands,
    colors,
  } = useLoaderData() as {
    campaign: Campaign;
    promotion: Promotion;
    products: Product[];
    totalPages: number;
    departments: Department[];
    productCategories: ProductCategory[];
    productSubCategories: ProductSubCategory[];
    brands: Brand[];
    colors: string[];
  };

  return (
    <PageWrapper>
      {(campaign || promotion) && (
        <BannerBlock
          content={{ campaign: campaign, promotion: promotion } as BlockContent}
        />
      )}

      <div className="w-[1280px] max-w-[100vw]">
        <ProductSort totalCount={products.length * totalPages} />
        <div className="my-3 w-full border-b border-brand-black/20" />

        <div className="flex w-full flex-wrap items-start justify-center gap-6 px-0 sm:w-full xl:flex-nowrap">
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

export default Products;

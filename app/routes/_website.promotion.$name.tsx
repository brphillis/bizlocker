import {
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import {
  type LoaderArgs,
  type ActionArgs,
  redirect,
} from "@remix-run/server-runtime";
import { useLoaderData } from "react-router-dom";
import ProductGrid from "~/components/Blocks/ProductGrid";
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

    if (products && products[0]?.promotionId) {
      const promotion = await getPromotion(products[0].promotionId);

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
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const submit = useSubmit();
  const navigate = useNavigate();

  const { promotion, products, totalPages } =
    (useLoaderData() as {
      promotion: Promotion;
      products: Product[];
      totalPages: number;
    }) || {};

  const { bannerImage, targetGender } =
    (promotion as {
      bannerImage: Image;
      targetGender: boolean;
    }) || {};

  return (
    <PageWrapper>
      <div className="max-w-screen w-screen sm:w-[1280px]">
        <img
          src={bannerImage?.url}
          alt={promotion?.name + "_bannerImage"}
          className="max-w-screen w-full object-cover"
        />
        {!targetGender && (
          <div className="flex w-full justify-center gap-3 bg-base-300 py-1">
            <button
              className="sm:text-md px-6 py-2 text-sm tracking-wide hover:bg-primary-content/10"
              onClick={() => navigate(pathname)}
            >
              All Deals
            </button>
            <button
              className="sm:text-md px-6 py-2 text-sm tracking-wide hover:bg-primary-content/10"
              onClick={() => {
                searchParams.set("gender", "MALE");
                submit(searchParams, {
                  method: "GET",
                  action: pathname,
                });
              }}
            >
              Mens
            </button>
            <button
              className="sm:text-md px-6 py-2 text-sm tracking-wide hover:bg-primary-content/10"
              onClick={() => {
                searchParams.set("gender", "FEMALE");
                submit(searchParams, {
                  method: "GET",
                  action: pathname,
                });
              }}
            >
              Womans
            </button>
            <button
              className="sm:text-md px-6 py-2 text-sm tracking-wide hover:bg-primary-content/10"
              onClick={() => {
                searchParams.set("gender", "KIDS");
                submit(searchParams, {
                  method: "GET",
                  action: pathname,
                });
              }}
            >
              Kids
            </button>
          </div>
        )}
      </div>

      <div className="divider !mb-0 hidden w-[1280px] self-center sm:flex" />

      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </PageWrapper>
  );
};

export default Promotion;

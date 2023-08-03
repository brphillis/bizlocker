import { useLoaderData } from "@remix-run/react";
import { type LoaderArgs } from "@remix-run/server-runtime";
import parse from "html-react-parser";
import { parseOptions } from "~/utility/parseOptions";
import PageWrapper from "~/components/Layout/PageWrapper";
import { getBrand } from "~/models/brands.server";
import { getProduct } from "~/models/products.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const productId = url.searchParams.get("id");
  const product = productId && (await getProduct(productId));
  const { brandId } = product || {};
  let brand;
  if (brandId) {
    brand = await getBrand(brandId.toString());
  }

  //   const rootCategories = await getRootCategories();
  //   const productCategories = await getProductCategories();
  //   const brands = await getBrands();
  //   const colors = await getAvailableColors();

  //   const productCategory = url.searchParams.get("productCategory")?.toString();
  //   const campaign = await getRandomCampaign(productCategory);

  return { product, brand };
};

// export const action = async ({ request }: ActionArgs) => {
//   const authenticated = await tokenAuth(request);
//   if (!authenticated.valid) {
//     return redirect("/login");
//   }
//   const form = Object.fromEntries(await request.formData());
//   const { variantId, quantity } = form;
//   switch (form._action) {
//     default:
//       return await addToCart(request, variantId as string, quantity as string);
//   }
// };

const Product = () => {
  const { product, brand } = useLoaderData();
  const { name, images, variants, description } = product as Product;
  const { name: brandName, image: brandImage } = brand;
  console.log(variants);
  console.log("prod", product);

  return (
    <PageWrapper>
      <div className="container mx-auto cursor-auto px-3">
        <div className="mx-auto flex">
          <div className="flex h-[780px] gap-3">
            <div className="scrollbar-hide flex h-full flex-col justify-start gap-3 overflow-auto">
              {images?.map(({ url }: Image, i: number) => {
                return (
                  <img
                    key={"productImage_" + i}
                    alt="ecommerce"
                    className="m-0 h-[calc(100%/3)] cursor-pointer object-cover shadow-sm"
                    src={url}
                  />
                );
              })}
            </div>
            <div className="relative h-full w-auto">
              <img
                alt={name + "_focusedImage"}
                className="h-full w-auto object-cover object-center shadow-md"
                src={images[0]?.url}
              />

              <img
                alt={brandName + "_image"}
                className="absolute bottom-4 right-4 h-20 w-auto"
                src={brandImage.url}
              />
            </div>
          </div>
          <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:py-6 lg:pl-10">
            <div className="pb-3">
              <h1 className="mb-1 text-3xl font-medium text-gray-900">
                {name}
              </h1>
              <h2 className="ml-1 text-sm tracking-widest text-gray-500">
                {brandName}
              </h2>
            </div>

            <div className="flex py-3">
              <div className="flex items-center">
                <span className="mr-3">Color</span>
                <button className="h-6 w-6 rounded-full border-2 border-gray-300 focus:outline-none"></button>
                <button className="ml-1 h-6 w-6 rounded-full border-2 border-gray-300 bg-gray-700 focus:outline-none"></button>
                <button className="ml-1 h-6 w-6 rounded-full border-2 border-gray-300 bg-primary focus:outline-none"></button>
              </div>
              <div className="ml-6 flex items-center">
                <span className="mr-3">Size</span>
                <div className="relative">
                  <select className="select border border-brand-black/20 text-brand-black">
                    <option>SM</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="my-3 w-full border-b border-brand-black/20" />

            <div className="flex items-center py-3">
              <span className="title-font text-2xl font-medium text-gray-900">
                $45.99
              </span>
              <button className="ml-auto flex rounded border-0 bg-primary px-6 py-2 text-white hover:bg-primary focus:outline-none">
                Buy
              </button>
              <button className="ml-4 inline-flex h-10 w-10 items-center justify-center rounded-full border-0 bg-gray-200 p-0 text-gray-500">
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </button>
            </div>
            <div className="my-3 w-full border-b border-brand-black/20" />
            <p className="py-3 leading-relaxed">
              {parse(description, parseOptions)}
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Product;

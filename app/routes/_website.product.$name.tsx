import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { type LoaderArgs } from "@remix-run/server-runtime";
import parse from "html-react-parser";
import { parseOptions } from "~/utility/parseOptions";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import { getBrand } from "~/models/brands.server";
import { getProduct } from "~/models/products.server";
import { getVariantUnitPrice } from "~/utility/numberHelpers";
import { generateColor } from "~/utility/colors";
import { useEffect, useState } from "react";
import { Toast } from "~/components/Notifications/Toast";
import {
  getAvailableColors,
  getAvailableSizes,
} from "~/utility/productHelpers";
import { IoHeart } from "react-icons/io5";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const productId = url.searchParams.get("id");
  const product = productId && (await getProduct(productId));
  const { brandId } = product || {};
  let brand;
  if (brandId) {
    brand = await getBrand(brandId.toString());
  }

  return { product, brand };
};

const Product = () => {
  const { product, brand } = useLoaderData();
  const submit = useSubmit();
  const { name, images, variants, description } = product as Product;
  const { name: brandName, image: brandImage } = brand;

  const [selectedSize, setSelectedSize] = useState<string>(variants[0].size);
  const [selectedColor, setSelectedColor] = useState<string>(variants[0].color);
  const [selectedImage, setSelectedImage] = useState<Image>(images[0]);

  const availableSizes = getAvailableSizes(product);

  const updateColors = (
    size: string,
    initializing: boolean
  ): string[] | undefined => {
    const colors = getAvailableColors(product, size);
    if (colors) {
      if (initializing) {
        return colors;
      }

      setAvailableColors(colors);
      setSelectedColor(colors[0]);
    }
  };

  const [availableColors, setAvailableColors] = useState<string[]>(
    updateColors(variants[0].size, true) as string[]
  );

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    variants[0]
  );

  const handleAddToCart = () => {
    const selectedProduct = returnProductFromSelections();

    if (selectedProduct) {
      const formData = new FormData();
      formData.set("variantId", selectedProduct.id.toString());
      formData.set("quantity", "1");

      submit(formData, {
        method: "POST",
        action: "/products",
        preventScrollReset: true,
        replace: true,
      });
      Toast("success", 2000, "Item Added");
    } else {
      Toast("warning", 2000, "Invalid Selection");
    }
  };

  const returnProductFromSelections = (): ProductVariant => {
    return variants.filter(
      (e) => e.size === selectedSize && e.color === selectedColor
    )[0];
  };

  useEffect(() => {
    const selection = variants.filter(
      (e) => e.size === selectedSize && e.color === selectedColor
    )[0];

    if (selection) {
      setSelectedVariant(selection);
    }
  }, [selectedColor, selectedSize, variants]);

  return (
    <PageWrapper>
      <div className="mx-auto cursor-auto px-3">
        <div className="mx-auto flex justify-center max-xl:flex-wrap">
          <div className="flex h-[740px] gap-3 max-xl:h-[70vh] max-xl:flex-col max-xl:gap-6">
            <div className="scrollbar-hide flex h-full flex-col justify-start gap-3 overflow-auto max-xl:order-2 max-xl:h-1/3 max-xl:flex-row">
              {images?.map(({ url }: Image, i: number) => {
                return (
                  <img
                    key={"productImage_" + i}
                    alt="ecommerce"
                    className="m-0 h-[calc(100%/3)] w-auto cursor-pointer object-cover shadow-sm max-xl:h-[200px] max-sm:shadow-md"
                    onClick={() => setSelectedImage(images[i])}
                    src={url}
                  />
                );
              })}
            </div>
            <div className="relative mx-auto block h-full w-max max-w-[100vw] max-xl:order-1 max-xl:h-2/3">
              <img
                alt={name + "_focusedImage"}
                className="h-full w-auto object-cover object-center shadow-md"
                src={selectedImage?.url}
              />

              <img
                alt={brandName + "_image"}
                className="absolute bottom-4 right-4 h-16 w-auto max-md:h-10"
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

            <div className="flex py-3 max-sm:justify-between">
              <div className="mr-6 flex items-center">
                <span className="mr-3">Size</span>
                <div className="relative">
                  <select
                    className="select border border-brand-black/20 text-brand-black"
                    onChange={(e) => {
                      setSelectedSize(e.target.value);
                      updateColors(e.target.value, false);
                    }}
                  >
                    {availableSizes?.map((size) => {
                      return (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {availableColors && (
                <div className="flex max-w-[205px] items-center justify-center">
                  <span className="mr-3">Available in</span>

                  {availableColors?.map((color) => {
                    return (
                      <button
                        key={color}
                        style={{
                          backgroundColor: generateColor(color),
                          border:
                            selectedColor === color
                              ? "3px solid #FFFFFF80"
                              : "none",
                        }}
                        className="ml-2 h-6 w-6 rounded-full border-2 border-gray-300 focus:outline-none"
                        onClick={() => setSelectedColor(color)}
                      ></button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="my-3 w-full border-b border-brand-black/20" />

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="mb-3 flex items-center gap-3 text-xs">
                  {selectedSize && selectedSize}
                  {selectedColor && "/" + selectedColor}
                  {selectedVariant.isPromoted && (
                    <div className="mb-[0.125rem] w-max bg-green-500 px-2 py-1 text-xs text-brand-white">
                      PROMO
                    </div>
                  )}
                  {selectedVariant.isOnSale && (
                    <div className="mb-[0.125rem] w-max bg-red-500 px-2 py-1 text-xs text-brand-white">
                      SALE
                    </div>
                  )}
                </div>
                <div className="title-font flex items-end gap-3 text-2xl font-medium text-gray-900">
                  {(selectedVariant.isOnSale || selectedVariant.isPromoted) && (
                    <div className="text-sm text-gray-400 line-through">
                      ${selectedVariant.price.toFixed(2)}
                    </div>
                  )}
                  ${getVariantUnitPrice(selectedVariant, product)}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="ml-auto flex border-0 bg-primary px-3 py-2 text-white hover:bg-primary focus:outline-none max-sm:order-2"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>

                <button className="ml-4 inline-flex h-10 w-10 items-center justify-center rounded-full border-0 bg-gray-200 p-0 text-gray-500">
                  <IoHeart size={20} />
                </button>
              </div>
            </div>
            <div className="my-3 w-full border-b border-brand-black/20" />
            <div className="py-3 leading-relaxed">
              {parse(description, parseOptions)}
            </div>

            <div className="my-3 w-full border-b border-brand-black/20" />

            <div className="leading-relaxed">
              <div>
                <b>Return Policy</b>
              </div>
              <div className="mt-1 max-w-full px-3 text-sm sm:px-0">
                <span className="font-semibold">Clutch.</span> returns all non
                promotion & sale items free of charge.
              </div>
              <Link
                to="/return-policy"
                className="max-w-full px-3 text-sm text-primary hover:underline sm:px-0"
              >
                Read more about our return policy.
              </Link>
            </div>

            <div className="my-3 w-full border-b border-brand-black/20" />

            <div className="leading-relaxed">
              <div>
                <b>Size Guide</b>
              </div>
              <Link
                to="/return-policy"
                className="max-w-full px-3 text-sm text-primary hover:underline sm:px-0"
              >
                Check out the size guide.
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="my-3 w-full border-b border-brand-black/20" />
    </PageWrapper>
  );
};

export default Product;

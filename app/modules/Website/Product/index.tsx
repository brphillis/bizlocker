import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Image } from "@prisma/client";
import Spinner from "~/components/Spinner";
import { parseOptions } from "~/utility/parseOptions";
import { generateProductColor } from "~/utility/colors";
import BasicImage from "~/components/Client/BasicImage";
import { Toast } from "~/components/Notifications/Toast";
import ProductGrid from "~/components/Grids/ProductGrid";
import { getVariantUnitPrice } from "~/helpers/numberHelpers";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";
import { productLoader } from "~/modules/Website/Product/index.server";
import {
  Link,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  ProductVariantWithDetails,
  ProductWithDetails,
} from "~/models/Products/types";
import {
  calculateVariantStock,
  getAvailableColors,
  getAvailableSizes,
} from "~/helpers/productHelpers";

const Product = () => {
  const { product, brand, similarProducts } =
    useLoaderData<typeof productLoader>();

  const submit = useSubmit();

  const { name, images, variants, description } = product;
  const { name: brandName, heroImage: brandImage } = brand || {};

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    variants?.[0]?.size || undefined,
  );
  const [selectedColor, setSelectedColor] = useState<string | null | undefined>(
    variants?.[0]?.color,
  );
  const [selectedImage, setSelectedImage] = useState<Image | undefined>(
    images?.[0],
  );

  const availableSizes = product && getAvailableSizes(product);

  const updateColors = (
    size?: string,
    initializing?: boolean,
  ): (string | null | undefined)[] | undefined => {
    if (size && product) {
      const colors = getAvailableColors(product, size);
      if (colors) {
        if (initializing) {
          return colors;
        }

        setAvailableColors(colors);
        setSelectedColor(colors[0]);
      }
    }
  };

  const [availableColors, setAvailableColors] = useState<
    (string | null | undefined)[] | undefined
  >(
    variants?.[0]?.size
      ? (updateColors(variants[0]?.size, true) as string[])
      : undefined,
  );

  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariantWithDetails | undefined
  >(variants?.[0]);

  const hasSizes = availableSizes && availableSizes[0] !== null;

  const hasColors =
    availableColors &&
    availableColors[0] !== null &&
    availableColors.length > 0;

  const handleAddToCart = () => {
    const selectedProduct = returnProductFromSelections();

    if (selectedProduct) {
      setLoading(true);
      const formData = new FormData();
      formData.set("variantId", selectedProduct.id.toString());
      formData.set("quantity", "1");

      submit(formData, {
        method: "POST",
        action: "/products",
        preventScrollReset: true,
        replace: true,
      });
    } else {
      Toast("warning", 2000, "Invalid Selection");
    }
  };

  const returnProductFromSelections = ():
    | ProductVariantWithDetails
    | undefined => {
    return variants?.filter(
      (e: ProductVariantWithDetails) =>
        e.size === selectedSize && e.color === selectedColor,
    )[0];
  };

  useEffect(() => {
    let selection = variants?.filter(
      (e: ProductVariantWithDetails) =>
        e.size === selectedSize && e.color === selectedColor,
    )[0];

    if (!hasColors) {
      selection = variants?.filter(
        (e: ProductVariantWithDetails) => e.size === selectedSize,
      )[0];
    }

    if (selection) {
      setSelectedVariant(selection);
    }
  }, [selectedColor, selectedSize, variants, images, hasColors]);

  useEffect(() => {
    const matchingImage = images?.find((e) =>
      e.tags.some((tag) => {
        const matchingFullColorName =
          tag.toLowerCase() === selectedVariant?.color?.toLowerCase();

        if (matchingFullColorName) {
          return matchingFullColorName;
        } else {
          // check for a matching color variant ei: dark BLUE, light BLUE, army GREEN
          if (Array.isArray(selectedVariant?.color?.split(" "))) {
            if (
              selectedVariant?.color?.split(" ")?.[1] &&
              selectedVariant?.color?.split(" ")?.[1].toLowerCase() ===
                tag.toLowerCase()
            ) {
              return true;
            }
          }
        }
      }),
    );

    if (matchingImage) {
      setSelectedImage(matchingImage);
    } else {
      setSelectedImage(images?.[0]);
    }
  }, [selectedVariant, images, variants]);

  const selectedVariantStock =
    selectedVariant && calculateVariantStock(selectedVariant);

  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (location && loading) {
      if (navigation.state === "submitting") {
        setSubmitted(true);
      }

      if (submitted && navigation.state === "idle") {
        Toast("success", 3000, "Item Added");

        setLoading(false);
        setSubmitted(false);
      }
    }
  }, [navigation, loading, submitted]);

  return (
    <PageWrapper>
      <div className="mx-auto cursor-auto pt-3 max-xl:pt-0">
        <div className="mx-auto flex justify-center max-xl:flex-wrap max-w-[100vw]">
          <div className="flex h-[740px] gap-3 max-xl:h-max max-xl:flex-col">
            {images && images.length > 1 && (
              <div className="max-xl:w-screen max-xl:h-max flex-nowrap w-[150px] max-xl:px-3 gap-3 scrollbar-hide flex h-full flex-col justify-start max-md:justify-center overflow-auto max-xl:order-2 max-xl:flex-row">
                {images.map(({ id, href, altText }: Image, i: number) => {
                  if (href) {
                    return (
                      <BasicImage
                        key={"productSlider_" + id + i}
                        alt={"productImage_" + altText + "_" + i}
                        onClick={() => setSelectedImage(images[i])}
                        extendStyle="w-full h-full cursor-pointer shadow-sm max-xl:!h-max max-sm:shadow-md"
                        skeletonStyle="max-md:h-[80px] max-md:w-[80px]"
                        src={href}
                      />
                    );
                  } else return null;
                })}
              </div>
            )}

            <div className="relative mx-auto block h-full w-[555px] max-w-[100vw] max-xl:order-1 max-xl:h-2/3">
              {selectedImage?.href && (
                <BasicImage
                  alt={name + "_focusedImage"}
                  extendStyle="h-full w-auto object-cover object-center shadow-md max-xl:px-3 max-xl:shadow-none !min-h-[390px]"
                  skeletonStyle="min-h-[380px]"
                  src={selectedImage?.href}
                />
              )}

              {brandImage?.href && (
                <BasicImage
                  alt={brandName + "_image"}
                  extendStyle="max-md:h-30 absolute bottom-2 right-4 h-16 w-auto max-md:bottom-2"
                  src={brandImage?.href}
                />
              )}
            </div>
          </div>

          <div className="w-[505px] max-w-full pl-12 max-xl:px-3 max-xl:w-full max-xl:py-3">
            {/* name and price */}
            <div className="flex gap-3 flex-col items-start">
              <div>
                <h1 className="mb-1 text-3xl font-medium text-gray-900">
                  {name}
                </h1>

                <div className="flex gap-6">
                  {brandName?.toLowerCase() !== "generic" && (
                    <h2 className="ml-1 text-sm tracking-widest text-gray-500">
                      {brandName}
                    </h2>
                  )}

                  <div className="ml-1 text-sm tracking-widest text-gray-500">
                    {selectedSize && selectedSize}
                    {selectedColor && "/" + selectedColor}
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-3 text-2xl font-medium text-gray-900">
                {(selectedVariant?.isOnSale || selectedVariant?.isPromoted) && (
                  <div className="text-sm text-gray-400 line-through">
                    ${selectedVariant?.price.toFixed(2)}
                  </div>
                )}
                $
                {selectedVariant &&
                  product &&
                  getVariantUnitPrice(selectedVariant, product)}{" "}
                AUD
                {selectedVariant?.isPromoted &&
                  selectedVariantStock &&
                  selectedVariantStock.totalStock > 0 && (
                    <div className="mb-1 w-max rounded-sm bg-green-500 px-2 py-1 text-xs text-brand-white">
                      PROMO
                    </div>
                  )}
                {selectedVariant?.isOnSale &&
                  selectedVariantStock &&
                  selectedVariantStock.totalStock > 0 && (
                    <div className="mb-1 w-max rounded-sm bg-red-500 px-2 py-1 text-xs text-brand-white">
                      SALE
                    </div>
                  )}
                {selectedVariantStock &&
                  selectedVariantStock.totalStock <= 0 && (
                    <div className="mb-1 w-max rounded-sm bg-red-500 px-2 py-1 text-xs text-brand-white">
                      NO STOCK
                    </div>
                  )}
              </div>
            </div>

            <div className="my-3 w-full border-b border-brand-black/20" />

            {/* colors and sizes */}
            <div>
              {(hasSizes || hasColors) && (
                <div className="flex py-3 max-sm:justify-between flex-wrap gap-6">
                  {hasSizes && (
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
                          {availableSizes?.map(
                            (size: string | null | undefined, i: number) => {
                              if (size) {
                                return (
                                  <option key={size + i} value={size}>
                                    {size}
                                  </option>
                                );
                              } else return null;
                            },
                          )}
                        </select>
                      </div>
                    </div>
                  )}

                  {hasColors && (
                    <div className="flex max-w-full items-center justify-center">
                      <span className="mr-3">Color</span>

                      {availableColors?.map((color, i) => {
                        if (color) {
                          return (
                            <div
                              tabIndex={0}
                              role="button"
                              key={color + i}
                              className={`ml-2 h-[20px] w-[20px] rounded-full border-2 border-gray-300 focus:outline-none 
                              ${selectedColor === color ? "animate-bounce" : ""}
                              ${
                                generateProductColor(color)
                                  ? "bg-" + generateProductColor(color)
                                  : "bg-neutral-400"
                              } `}
                              onClick={() => setSelectedColor(color)}
                              onKeyDown={() => setSelectedColor(color)}
                            />
                          );
                        } else return null;
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="my-3 w-full border-b border-brand-black/20" />

            {/* cart buttons */}
            <div className="max-xl:py-3 flex justify-between max-md:flex-col max-xl:items-center w-full max-xl:justify-center max-xl:gap-3">
              <button
                disabled={
                  selectedVariantStock && selectedVariantStock.totalStock <= 0
                }
                className="max-md:w-full text-center tracking-wider w-[220px] border-0 bg-brand-green hover:scale-[1.01] transition-all duration-300 ease-in-out font-bold px-3 py-3 rounded-full text-white disabled:opacity-50 max-sm:order-2"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>

              <button
                disabled={
                  selectedVariantStock && selectedVariantStock.totalStock <= 0
                }
                className="max-md:w-full text-center tracking-wider w-[220px] border-0 bg-primary hover:scale-[1.01] transition-all duration-300 ease-in-out font-bold px-3 py-3 rounded-full text-white disabled:opacity-50 max-sm:order-2"
                onClick={handleAddToCart}
              >
                ADD TO WISHLIST
              </button>
            </div>

            <div className="my-3 w-full border-b border-brand-black/20" />

            {/* description */}

            <div className="pt-1 max-md:pb-3 leading-relaxed">
              <h3 className="font-bold pb-3 max-md:pl-3">Description</h3>
              <div className="pl-[1px]">
                {description && parse(description, parseOptions)}
              </div>
            </div>

            <div className="my-3 w-full border-b border-brand-black/20" />

            <div className="pt-1 max-md:pb-3 leading-relaxed">
              <div className="leading-relaxed max-md:px-3">
                <div>
                  <b>Return Policy</b>
                </div>
                <div className="mt-1 max-w-full text-sm">
                  <span className="font-semibold">Clutch.</span> returns all non
                  promotion & sale items free of charge.
                </div>
                <Link
                  to="/return-policy"
                  className="max-w-full text-sm text-primary hover:underline"
                >
                  Read more about our return policy.
                </Link>
              </div>

              <div className="my-3 w-full border-b border-brand-black/20" />

              {/* {hasSizes && (
                <div className="leading-relaxed max-md:px-3">
                  <div>
                    <b>Size Guide</b>
                  </div>
                  <Link
                    to="/size-guide"
                    className="max-w-full text-sm text-primary hover:underline"
                  >
                    Check out the size guide.
                  </Link>
                </div>
              )} */}

              {/* <div className="my-3 w-full border-b border-brand-black/20" /> */}
            </div>
          </div>
        </div>
      </div>

      <>
        {similarProducts && similarProducts.length > 0 && (
          <>
            <p className="self-start pb-3 pl-3 text-xl font-bold md:pl-1">
              You might also like...
            </p>
            <ProductGrid
              products={similarProducts as ProductWithDetails[]}
              columns="grid-cols-5"
              enablePlaceHolder={true}
            />
          </>
        )}
      </>

      <>
        {loading && (
          <div className="fixed bottom-3 right-3 z-50">
            <Spinner mode="circle" />
          </div>
        )}
      </>
    </PageWrapper>
  );
};

export default Product;

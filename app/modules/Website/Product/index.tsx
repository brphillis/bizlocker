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
  const { name: brandName, image: brandImage } = brand || {};

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
    const selection = variants?.filter(
      (e: ProductVariantWithDetails) =>
        e.size === selectedSize && e.color === selectedColor,
    )[0];

    if (selection) {
      setSelectedVariant(selection);
    }
  }, [selectedColor, selectedSize, variants]);

  useEffect(() => {
    if (images?.[0]) setSelectedImage(images[0]);
  }, [images]);

  const hasSizes = availableSizes && availableSizes[0] !== null;
  const hasColors = availableColors && availableColors[0] !== null;

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
      <div className="mx-auto cursor-auto px-3 pt-3 max-xl:px-0 max-xl:pt-0">
        <div className="mx-auto flex justify-center max-xl:flex-wrap">
          <div className="flex h-[740px] gap-3 max-xl:h-max max-xl:flex-col max-xl:gap-6">
            <div className="max-xl:w-screen max-xl:h-max w-[150px] max-xl:px-3 gap-3 scrollbar-hide flex h-full flex-col justify-start overflow-auto max-xl:order-2 max-xl:flex-row">
              {images?.map(({ id, href }: Image, i: number) => {
                if (href) {
                  return (
                    <div
                      key={"productSlider_" + id + i}
                      className="m-0 w-full cursor-pointer object-cover shadow-sm max-xl:h-max max-sm:shadow-md"
                    >
                      <BasicImage
                        alt="ecommerce"
                        onClick={() => setSelectedImage(images[i])}
                        src={href}
                      />
                    </div>
                  );
                } else return null;
              })}
            </div>
            <div className="relative mx-auto block h-full w-max max-w-[100vw] max-xl:order-1 max-xl:h-2/3">
              {selectedImage?.href && (
                <BasicImage
                  alt={name + "_focusedImage"}
                  extendStyle="h-full w-auto object-cover object-center shadow-md max-xl:px-3 max-xl:shadow-none"
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

          <div className="mt-6 w-full max-xl:px-3 lg:mt-0 lg:w-1/2 lg:py-6 lg:pl-10">
            <div className="pb-3">
              <h1 className="mb-1 text-3xl font-medium text-gray-900">
                {name}
              </h1>
              {brandName?.toLowerCase() !== "none" && (
                <h2 className="ml-1 text-sm tracking-widest text-gray-500">
                  {brandName}
                </h2>
              )}
            </div>

            {(hasSizes || hasColors) && (
              <div className="flex py-3 max-sm:justify-between">
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
                  <div className="flex max-w-[205px] items-center justify-center">
                    <span className="mr-3">Available in</span>

                    {availableColors?.map((color, i) => {
                      if (color) {
                        return (
                          <button
                            key={color + i}
                            className={`ml-2 h-6 w-6 rounded-full border-2 border-gray-300 focus:outline-none 
                            ${selectedColor === color ? "animate-bounce" : ""}
                            ${"bg-" + generateProductColor(color)}`}
                            onClick={() => setSelectedColor(color)}
                          ></button>
                        );
                      } else return null;
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="my-3 w-full border-b border-brand-black/20" />

            <div className="flex items-end justify-between py-3">
              <div>
                <div className=" flex items-center gap-3 text-xs">
                  {selectedSize && selectedSize}
                  {selectedColor && "/" + selectedColor}
                </div>

                <div className="title-font flex items-end gap-3 text-2xl font-medium text-gray-900">
                  {(selectedVariant?.isOnSale ||
                    selectedVariant?.isPromoted) && (
                    <div className="text-sm text-gray-400 line-through">
                      ${selectedVariant?.price.toFixed(2)}
                    </div>
                  )}
                  $
                  {selectedVariant &&
                    product &&
                    getVariantUnitPrice(selectedVariant, product)}
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

              <div className="flex items-center gap-3">
                <button
                  disabled={
                    selectedVariantStock && selectedVariantStock.totalStock <= 0
                  }
                  className="ml-auto flex !rounded-sm border-0 bg-primary px-3 py-2 text-white hover:bg-primary focus:outline-none disabled:opacity-50 max-sm:order-2"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>

                {/* <button className="ml-4 inline-flex h-10 w-10 items-center justify-center rounded-full border-0 bg-gray-200 p-0 text-gray-500">
                  <IoHeart size={20} />
                </button> */}
              </div>
            </div>
            <div className="my-3 w-full border-b border-brand-black/20" />
            <div className="py-3 leading-relaxed">
              {description && parse(description, parseOptions)}
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

            {hasSizes && (
              <div className="leading-relaxed">
                <div>
                  <b>Size Guide</b>
                </div>
                <Link
                  to="/size-guide"
                  className="max-w-full px-3 text-sm text-primary hover:underline sm:px-0"
                >
                  Check out the size guide.
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="my-3 w-full border-b border-brand-black/20" />

      <>
        {similarProducts && similarProducts.length > 0 && (
          <>
            <p className="self-start pb-3 pl-3 text-xl font-bold md:pl-1">
              You might also like...
            </p>
            <ProductGrid
              products={similarProducts as ProductWithDetails[]}
              cols={5}
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

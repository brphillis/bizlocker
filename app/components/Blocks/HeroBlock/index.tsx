import { useNavigate } from "@remix-run/react";
import { getThemeColorValueByName } from "~/utility/colors";
import type { BlockContent } from "~/models/blocks.server";
import type { BlockOptions, Product } from "@prisma/client";
import PatternBackground from "~/components/Layout/PatternBackground";
import { determineSingleContentType } from "~/helpers/blockContentHelpers";
import type {
  ProductVariantWithDetails,
  ProductWithDetails,
} from "~/models/products.server";
type Props = {
  content: BlockContent;
  options: BlockOptions[];
};

const HeroBlock = ({ content, options: optionsArray }: Props) => {
  const navigate = useNavigate();
  const options = optionsArray[0];
  const {
    title,
    titleColor,
    shortText,
    shortTextColor,
    backgroundColor,
    margin,
    flipX,
    backgroundColorSecondary,
    backgroundBrightnessSecondary,
    backgroundPatternColorSecondary,
    backgroundPatternNameSecondary,
    backgroundPatternOpacitySecondary,
    backgroundPatternSizeSecondary,
    borderColor,
    borderDisplay,
    borderSize,
    borderRadius,
    padding,
    primaryLink,
    secondaryLink,
  } = options || {};

  const product = content.product as ProductWithDetails;
  const productImage = product.heroImage?.href;

  const contentType = determineSingleContentType(content);

  const getProductLowestPrice = (
    product: ProductWithDetails,
    decimals?: boolean
  ) => {
    const prices = product?.variants?.map(
      ({ price }: ProductVariantWithDetails) => price
    );
    if (prices) {
      const lowestPrice = Math.min(...prices);
      if (decimals) {
        return lowestPrice.toFixed(2);
      } else return lowestPrice.toFixed(0);
    }
  };

  const lowestPrice = getProductLowestPrice(product);

  return (
    <div
      className={`relative h-max w-full ${margin} ${padding}`}
      style={{
        paddingTop: backgroundColorSecondary ? "24px" : "unset",
        paddingBottom: backgroundColorSecondary ? "24px" : "unset",
      }}
    >
      <PatternBackground
        name={backgroundPatternNameSecondary as BackgroundPatternName}
        backgroundColor={
          backgroundColorSecondary
            ? getThemeColorValueByName(backgroundColorSecondary)
            : ""
        }
        patternColor={
          backgroundPatternColorSecondary
            ? getThemeColorValueByName(backgroundPatternColorSecondary)
            : ""
        }
        patternOpacity={backgroundPatternOpacitySecondary || 0.5}
        patternSize={backgroundPatternSizeSecondary || 32}
        brightness={backgroundBrightnessSecondary || undefined}
        screenWidth={true}
      />

      <div
        className={`relative flex items-center bg-white shadow-sm 
        ${borderDisplay} ${borderRadius} ${flipX} ${backgroundColor} ${borderSize} ${borderColor}`}
      >
        <div className="container relative mx-auto flex px-20 py-12 max-xl:px-16 max-lg:px-12 max-md:px-3 max-md:py-6">
          <div className="relative mr-16 flex w-[60%] flex-col gap-[20%] max-md:w-4/5 max-md:justify-between max-md:gap-16 max-sm:mr-0">
            <div>
              <h1
                className={`flex max-w-[500px] select-none flex-col text-7xl font-bold uppercase leading-none max-md:max-w-[200px] max-md:text-4xl max-md:leading-10 
                ${flipX} ${titleColor}`}
              >
                {title}
              </h1>

              {lowestPrice && (
                <h2
                  className={`mt-6 flex max-w-[500px] flex-col text-4xl font-bold uppercase leading-none max-md:mt-3 max-md:max-w-[250px] max-md:text-2xl 
                  ${flipX} ${titleColor}`}
                >
                  From ${parseFloat(lowestPrice).toFixed(2)}
                </h2>
              )}
            </div>

            <div className="flex flex-col items-start">
              <p
                className={`select-none text-lg max-md:max-w-[220px] max-md:text-sm ${flipX} ${shortTextColor}`}
              >
                {shortText}
              </p>
              <div className={`mt-8 flex ${flipX}`}>
                {(contentType === "product" || primaryLink) && (
                  <div
                    onClick={() =>
                      navigate(
                        contentType === "product"
                          ? `/product/SlackSki%20Jacket?id=${
                              (content.product as Product).id
                            }`
                          : (primaryLink as string)
                      )
                    }
                    className="text-md mr-4 cursor-pointer rounded-sm border-2 border-transparent bg-primary px-4 py-2 uppercase text-white hover:bg-primary"
                  >
                    Buy Now
                  </div>
                )}
                {secondaryLink && (
                  <div
                    className="text-md cursor-pointer rounded-sm border-2 border-primary bg-transparent px-4 py-2 uppercase text-primary hover:bg-primary hover:text-white dark:text-white"
                    onClick={() => navigate(secondaryLink as string)}
                  >
                    Read more
                  </div>
                )}
              </div>
            </div>
          </div>
          {productImage && (
            <img
              className="relative h-auto max-h-full max-w-full object-contain transition duration-300 ease-in-out hover:scale-[1.05] max-lg:absolute max-lg:left-[75%] max-lg:w-64 max-md:left-[52%] max-md:w-48"
              src={productImage}
              alt="hero"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBlock;

import { generateColor } from "~/utility/colors";

type Props = {
  content: any;
  options?: BlockOptions;
};

const HeroBlock = ({ content: contentArray, options }: Props) => {
  const content = contentArray[0];
  const {
    title,
    titleColor,
    shortText,
    shortTextColor,
    backgroundColor,
    margin,
    borderColor,
    borderDisplay,
    borderSize,
    borderRadius,
  } = options || {};

  const product = content.product as Product;
  const productImage = product.heroImage?.url;

  const getProductLowestPrice = (product: Product, decimals?: boolean) => {
    const prices = product.variants.map(({ price }: ProductVariant) => price);
    const lowestPrice = Math.min(...prices);
    if (decimals) {
      return lowestPrice.toFixed(2);
    } else return lowestPrice.toFixed(0);
  };

  const lowestPrice = getProductLowestPrice(product);

  return (
    <div
      style={{
        backgroundColor: generateColor(backgroundColor),
        border:
          borderSize && borderColor
            ? borderSize + " solid " + generateColor(borderColor)
            : "unset",
        borderRadius: borderRadius ? borderRadius : "unset",
      }}
      className={`relative flex h-max w-full items-center overflow-hidden bg-white ${margin} ${borderDisplay}`}
    >
      <div className="container relative mx-auto flex px-20 py-12 max-xl:px-16 max-lg:px-12 max-md:px-3 max-md:py-6">
        <div className="relative z-20 mr-16 flex w-[60%] flex-col gap-20 max-md:w-4/5 max-md:gap-16 max-sm:mr-0">
          <div>
            <h1
              style={{ color: generateColor(titleColor) }}
              className="flex max-w-[500px] flex-col text-8xl font-bold uppercase leading-none max-md:max-w-[250px] max-md:text-5xl"
            >
              {title}
            </h1>

            {lowestPrice && (
              <h2
                style={{ color: generateColor(titleColor) }}
                className="mt-3 flex max-w-[500px] flex-col text-4xl font-bold uppercase leading-none max-md:max-w-[250px] max-md:text-2xl"
              >
                From ${lowestPrice}
              </h2>
            )}
          </div>

          <div className="flex flex-col items-start">
            <p
              style={{ color: generateColor(shortTextColor) }}
              className="text-sm sm:text-base"
            >
              {shortText}
            </p>
            <div className="mt-8 flex">
              <div className="text-md mr-4 cursor-pointer rounded-lg border-2 border-transparent bg-primary px-4 py-2 uppercase text-white hover:bg-primary">
                Buy Now
              </div>
              <div className="text-md cursor-pointer rounded-lg border-2 border-primary bg-transparent px-4 py-2 uppercase text-primary hover:bg-primary hover:text-white dark:text-white">
                Read more
              </div>
            </div>
          </div>
        </div>
        <div className="relative block h-[30rem] w-[30rem] max-md:absolute max-md:right-3 max-md:top-8 max-md:h-48 max-md:w-48 max-sm:h-36 max-sm:w-36">
          <img
            src={productImage}
            className="m-auto mt-8 max-h-full max-w-full max-xl:mt-0"
            alt="hero"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroBlock;

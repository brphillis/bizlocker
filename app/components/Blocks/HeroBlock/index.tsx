import { useNavigate } from "@remix-run/react";
import { determineSingleContentType } from "~/helpers/blockContentHelpers";
import { generateColor } from "~/utility/colors";

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
    backgroundColorTwo,
    borderColor,
    borderDisplay,
    borderSize,
    borderRadius,
    padding,
    linkOne,
    linkTwo,
  } = options || {};

  const product = content.product as Product;
  const productImage = product.heroImage?.url;

  const contentType = determineSingleContentType(content);

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
      className={`relative h-max w-full ${padding}`}
      style={{
        paddingTop: backgroundColorTwo ? "1.5rem" : "unset",
        paddingBottom: backgroundColorTwo ? "1.5rem" : "unset",
      }}
    >
      <div
        className="absolute left-[50%] top-[50%] h-full w-screen translate-x-[-50%] translate-y-[-50%] max-md:hidden"
        style={{
          backgroundColor: generateColor(backgroundColorTwo),
          width: "100vw",
        }}
      ></div>

      <div
        className={`relative flex items-center bg-white shadow-sm ${margin} ${borderDisplay} ${flipX}`}
        style={{
          backgroundColor: generateColor(backgroundColor),
          border:
            borderSize && borderColor
              ? borderSize + " solid " + generateColor(borderColor)
              : "unset",
          borderRadius: borderRadius ? borderRadius : "unset",
        }}
      >
        <div className="container relative mx-auto flex px-20 py-12 max-xl:px-16 max-lg:px-12 max-md:px-3 max-md:py-6">
          <div className="relative mr-16 flex w-[60%] flex-col justify-between max-md:w-4/5 max-md:gap-16 max-sm:mr-0">
            <div>
              <h1
                className={`flex max-w-[500px] select-none flex-col text-7xl font-bold uppercase leading-none max-md:max-w-[250px] max-md:text-5xl ${flipX}`}
                style={{
                  color: generateColor(titleColor),
                }}
              >
                {title}
              </h1>

              {lowestPrice && (
                <h2
                  className={`mt-3 flex max-w-[500px] flex-col text-4xl font-bold uppercase leading-none max-md:max-w-[250px] max-md:text-2xl ${flipX}`}
                  style={{
                    color: generateColor(titleColor),
                  }}
                >
                  From ${lowestPrice}
                </h2>
              )}
            </div>

            <div className="flex flex-col items-start">
              <p
                className={`select-none text-sm sm:text-base ${flipX}`}
                style={{
                  color: generateColor(shortTextColor),
                }}
              >
                {shortText}
              </p>
              <div className={`mt-8 flex ${flipX}`}>
                {(contentType === "product" || linkOne) && (
                  <div
                    onClick={() =>
                      navigate(
                        contentType === "product"
                          ? `/product/SlackSki%20Jacket?id=${
                              (content.product as Product).id
                            }`
                          : (linkOne as string)
                      )
                    }
                    className="text-md mr-4 cursor-pointer rounded-sm border-2 border-transparent bg-primary px-4 py-2 uppercase text-white hover:bg-primary"
                  >
                    Buy Now
                  </div>
                )}
                {linkTwo && (
                  <div
                    className="text-md cursor-pointer rounded-sm border-2 border-primary bg-transparent px-4 py-2 uppercase text-primary hover:bg-primary hover:text-white dark:text-white"
                    onClick={() => navigate(linkTwo as string)}
                  >
                    Read more
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative block h-[30rem] w-[30rem] max-md:absolute max-md:right-5 max-md:top-8 max-md:h-48 max-md:w-48 max-sm:right-2 max-sm:h-48 max-sm:w-48">
            <img
              className="m-auto mt-8 max-h-full max-w-full transition duration-300 ease-in-out hover:scale-[1.05] max-xl:mt-0"
              src={productImage}
              alt="hero"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBlock;

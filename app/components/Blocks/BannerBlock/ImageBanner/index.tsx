import type { BlockOptions } from "@prisma/client";
import BasicImage from "~/components/Client/BasicImage";

type Props = {
  options: BlockOptions;
  imageAlt: string;
  imageSrc: string;
  imageLink: string | null;
};

const ImageBanner = ({ options, imageSrc, imageLink, imageAlt }: Props) => {
  const {
    borderColor,
    borderRadius,
    borderSize,
    size,
    align,
    alignMobile,
    justify,
    justifyMobile,
    shortText,
    shortTextColor,
    shortTextFontWeight,
    shortTextFontWeightMobile,
    shortTextSize,
    shortTextSizeMobile,
    title,
    titleColor,
    titleFontWeight,
    titleFontWeightMobile,
    titleSize,
    titleSizeMobile,
  } = options || {};

  const smallStyle =
    "h-[146px] w-full max-w-[1280px] overflow-hidden max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]";

  const mediumStyle =
    "h-[219px] w-full max-w-[1280px] max-xl:h-[186px] max-lg:h-[125px] max-md:h-[132px]";

  const largeStyle =
    "h-[292px] w-[1400px] max-w-[1280px] max-xl:h-[248px] max-lg:h-[224px] max-md:h-[196px]";

  const nativeStyle = `max-xl:h-[248px] max-lg:h-[224px] max-md:h-[148px]`;

  let currentStyle = smallStyle;

  switch (size) {
    case "small":
      currentStyle = smallStyle;
      break;
    case "medium":
      currentStyle = mediumStyle;
      break;

    case "large":
      currentStyle = largeStyle;
      break;
    case "native":
      currentStyle = nativeStyle;
      break;
  }

  return (
    <div className="relative">
      <BasicImage
        link={imageLink}
        src={imageSrc}
        alt={imageAlt}
        extendStyle={`relative mx-auto object-cover block ${currentStyle} ${borderSize} ${borderColor} ${borderRadius} 
            ${imageLink ? "cursor-pointer" : ""}`}
      />

      <div
        className={`p-[2%] select-none absolute top-0 bottom-0 text-center left-1/2 translate-x-[-50%] flex w-full gap-2 max-md:gap-1
          ${justify ? justify : "justify-center"} 
          ${align ? align : "items-center"}
          ${justifyMobile} ${alignMobile}`}
      >
        <h1
          className={`drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] ${titleSize} ${titleSizeMobile}
              ${titleColor} ${titleFontWeight} ${titleFontWeightMobile}`}
        >
          {title}
        </h1>
        <h2
          className={`text-3xl max-md:text-lg ${shortTextSize} ${shortTextSizeMobile}
              ${shortTextColor} ${shortTextFontWeight} ${shortTextFontWeightMobile}`}
        >
          {shortText}
        </h2>
      </div>
    </div>
  );
};

export default ImageBanner;

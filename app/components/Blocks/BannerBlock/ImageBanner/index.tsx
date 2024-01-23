import type { BlockOptions } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import BasicImage from "~/components/Client/BasicImage";

type Props = {
  options: BlockOptions;
  imageAlt: string;
  imageSrc: string;
  imageLink: string | null;
};

const ImageBanner = ({ options, imageSrc, imageLink, imageAlt }: Props) => {
  const navigate = useNavigate();

  const { borderColor, borderRadius, borderSize, size } = options || {};

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
    <BasicImage
      onClick={() => imageLink && navigate(imageLink)}
      src={imageSrc}
      alt={imageAlt}
      extendStyle={`relative mx-auto object-cover block ${currentStyle} ${borderSize} ${borderColor} ${borderRadius} 
        ${imageLink ? "cursor-pointer" : ""}`}
    />
  );
};

export default ImageBanner;

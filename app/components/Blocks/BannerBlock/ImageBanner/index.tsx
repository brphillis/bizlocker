import type { BlockOptions } from "@prisma/client";
import { useNavigate } from "@remix-run/react";

type Props = {
  options: BlockOptions;
  imageAlt: string;
  imageSrc: string;
  imageLink: string | null;
};

const ImageBanner = ({ options, imageSrc, imageLink, imageAlt }: Props) => {
  const navigate = useNavigate();
  const {
    backgroundColorSecondary,
    borderColor,
    borderRadius,
    borderSize,
    size,
  } = options || {};

  return (
    <>
      {size === "small" && (
        <img
          onClick={() => imageLink && navigate(imageLink)}
          src={imageSrc}
          alt={imageAlt}
          className={`relative mx-auto block h-[146px] w-full max-w-[1280px] overflow-hidden object-cover max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]
          ${borderSize} ${borderColor} ${borderRadius}
          ${backgroundColorSecondary ? "h-[170px] py-3" : " "}
          ${imageLink ? "cursor-pointer" : " "}`}
        />
      )}

      {(!size || size === "medium") && (
        <img
          onClick={() => imageLink && navigate(imageLink)}
          src={imageSrc}
          alt={imageAlt}
          className={`relative mx-auto block h-[219px] w-full max-w-[1280px] object-cover max-xl:h-[186px] max-lg:h-[125px] max-md:h-[132px]
          ${borderSize} ${borderColor} ${borderRadius}
          ${backgroundColorSecondary ? "h-[243px] py-3" : " "}
          ${imageLink ? "cursor-pointer" : " "}`}
        />
      )}

      {size === "large" && (
        <img
          onClick={() => imageLink && navigate(imageLink)}
          src={imageSrc}
          alt={imageAlt}
          className={`relative h-[292px] w-[1400px] max-w-[1280px] object-cover max-xl:h-[248px] max-lg:h-[224px] max-md:h-[196px] 
         ${borderSize} ${borderColor} ${borderRadius}
         ${imageLink ? "cursor-pointer" : " "}`}
        />
      )}

      {size === "native" && (
        <img
          onClick={() => imageLink && navigate(imageLink)}
          src={imageSrc}
          alt={imageAlt}
          className={`relative object-cover shadow-md max-xl:h-[248px] max-lg:h-[224px] max-md:h-[148px] 
          ${borderSize} ${borderColor} ${borderRadius}
          ${backgroundColorSecondary ? "h-[272px] py-3" : " "}
          ${imageLink ? "cursor-pointer" : " "}`}
        />
      )}
    </>
  );
};

export default ImageBanner;

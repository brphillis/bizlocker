import type { BlockOptions } from "@prisma/client";
import ContentContainer from "./ContentContainer";

type Props = {
  index: number;
  blockOptions: BlockOptions;
  image: { altText: string; src: string };
};

const Slide = ({ index, blockOptions, image }: Props) => {
  const {
    itemAlign,
    itemAlignMobile,
    itemBorderColors,
    itemBorderDisplays,
    itemBorderRadius,
    itemBorderSizes,
    itemImagePositions,
    itemImagePositionsMobile,
    itemJustify,
    itemJustifyMobile,
  } = blockOptions || {};

  return (
    <div
      className={`relative flex h-full w-full overflow-hidden 
      max-md:rounded-none
     ${itemBorderDisplays[index]} ${itemBorderColors[index]} ${itemBorderRadius[index]} ${itemBorderSizes[index]} 
     ${itemAlign?.[index]} ${itemAlignMobile[index]} ${itemJustify[index]} ${itemJustifyMobile[index]}
   `}
    >
      <img
        src={image.src}
        alt={image.altText || "image description placeholder"}
        className={`absolute h-full w-full select-none object-cover
       ${itemImagePositions[index]} ${itemImagePositionsMobile[index]}`}
      />

      <ContentContainer index={index} blockOptions={blockOptions} />
    </div>
  );
};

export default Slide;

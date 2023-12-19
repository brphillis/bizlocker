import type { BlockOptions } from "@prisma/client";
import { returnOtherColorPrefix } from "~/utility/colors";
import ButtonContainer from "./ButtonContainer";

type Props = {
  index: number;
  blockOptions: BlockOptions;
};

const ContentContainer = ({ index, blockOptions }: Props) => {
  const {
    itemColors,
    itemPrimaryButtons,
    itemShortText,
    itemShortTextColors,
    itemShortTextSizes,
    itemShortTextSizesMobile,
    itemTitleColors,
    itemTitles,
    itemTitleSizes,
    itemTitleSizesMobile,
  } = blockOptions;

  const hasCardContent =
    itemTitles[index] || itemShortText[index] || itemPrimaryButtons?.[index];

  return (
    <div
      className={`relative z-10 m-12 h-max w-max max-w-full select-none flex-col items-center gap-6 p-6 font-semibold 
        max-md:m-0 max-md:gap-3 
        ${hasCardContent ? "flex" : "hidden"} 
        ${
          itemColors[index]
            ? returnOtherColorPrefix(itemColors[index], "bg-")
            : ""
        }`}
    >
      {itemTitles[index] && (
        <div
          className={`${itemTitleColors[index]} ${itemTitleSizes[index]} ${itemTitleSizesMobile[index]}`}
        >
          {itemTitles[index]}
        </div>
      )}

      {itemShortText[index] && (
        <div
          className={`select-none text-center max-md:max-w-[80%]
           ${itemShortTextColors[index]} ${itemShortTextSizes[index]} ${itemShortTextSizesMobile[index]}`}
        >
          {itemShortText[index]}
        </div>
      )}

      <ButtonContainer index={index} blockOptions={blockOptions} />
    </div>
  );
};

export default ContentContainer;

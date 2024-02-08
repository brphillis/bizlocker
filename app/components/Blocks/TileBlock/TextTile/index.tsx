import { BlockOptions } from "@prisma/client";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";
import TextContainer from "../../_ItemComponents/TextContainer";

type Props = {
  blockOptions: BlockOptions;
  index: number;
};

const TextTile = ({ blockOptions, index }: Props) => {
  const { itemBackgroundColorsPrimary, itemBorderRadius } = blockOptions;

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center 
      ${itemBorderRadius[index]}`}
    >
      <PatternBackground
        backgroundColor={getThemeColorValueByName(
          itemBackgroundColorsPrimary[index],
        )}
      />

      <TextContainer
        blockOptions={blockOptions}
        index={index}
        position="relative"
      />
    </div>
  );
};

export default TextTile;

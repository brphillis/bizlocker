import Icon from "~/components/Icon";
import * as IconsIO5 from "react-icons/io5";
import { BlockOptions } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import { BlockContentSorted } from "~/models/Blocks/types";
import { getThemeColorValueByName } from "~/utility/colors";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";

type Props = {
  blockOptions: BlockOptions;
  index: number;
  content: BlockContentSorted[];
};

const IconTile = ({ content, blockOptions, index }: Props) => {
  const navigate = useNavigate();

  const {
    itemBackgroundColorsPrimary,
    itemBorderRadius,
    itemColors,
    itemFilters,
    itemLinks,
    itemTitleColors,
    itemTitles,
  } = blockOptions;

  return (
    <button
      type="button"
      className={`relative flex h-full w-full flex-col items-center justify-center
      ${itemFilters[index]} 
      ${itemBorderRadius[index] ? "p-3" : " "}
      ${
        itemBorderRadius[index] === "rounded-full" ||
        itemBorderRadius[index]?.includes("mask")
          ? "max-md:!p-2"
          : " "
      }`}
      onClick={() => (itemLinks[index] ? navigate(itemLinks[index]) : null)}
    >
      <PatternBackground
        backgroundColor={getThemeColorValueByName(
          itemBackgroundColorsPrimary[index],
        )}
      />

      <Icon
        iconName={content[index].icon as keyof typeof IconsIO5}
        size={1000}
        extendStyle="relative h-[80%] w-[80%] p-[20%] -mb-2 -mt-[20%] max-md:-mt-3"
        color={
          itemColors[index]
            ? getThemeColorValueByName(itemColors[index])
            : undefined
        }
      />
      {itemTitles[index] && itemTitles[index] !== "undefined" && (
        <p
          className={`relative -mt-[15%] font-bold max-md:-mt-1 max-md:!text-xs ${itemTitleColors[index]}`}
          style={{
            fontSize: "150%",
          }}
        >
          {itemTitles[index]}
        </p>
      )}
    </button>
  );
};

export default IconTile;

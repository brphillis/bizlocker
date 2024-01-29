import { BlockOptions } from "@prisma/client";
import Divider from "~/components/Filter/ProductFilterSideBar/Divider";
import { returnOtherColorPrefix } from "~/utility/colors";

type Props = {
  blockOptions: BlockOptions;
  otherTitle?: string;
};

const Title = ({ blockOptions, otherTitle }: Props) => {
  const { title, titleAlign, titleColor, titleFontWeight, titleSize } =
    blockOptions || {};

  const returnTextToFlexAlignment = (titleAlignValue?: string | null) => {
    switch (titleAlignValue) {
      case "text-center": {
        return "items-center";
      }

      case "text-left": {
        return "items-start";
      }

      case "text-right": {
        return "items-end";
      }

      default: {
        return "";
      }
    }
  };

  return (
    <div className={`relative w-full pb-6`}>
      <div
        className={`relative flex 
        ${returnTextToFlexAlignment(titleAlign)} 
        ${titleSize} ${titleColor} ${titleFontWeight}`}
      >
        {titleAlign === "text-center" && (
          <Divider
            extendStyle={`${
              titleColor
                ? returnOtherColorPrefix(titleColor, "border-") + "/10"
                : ""
            }`}
          />
        )}

        <div
          className={`relative select-none w-max max-md:px-3 text-nowrap
         ${titleAlign !== "text-center" ? "px-3" : "px-6"}`}
        >
          {otherTitle || title}
        </div>

        {titleAlign === "text-center" && (
          <Divider
            extendStyle={`${
              titleColor
                ? returnOtherColorPrefix(titleColor, "border-") + "/10"
                : ""
            }`}
          />
        )}
      </div>
    </div>
  );
};

export default Title;

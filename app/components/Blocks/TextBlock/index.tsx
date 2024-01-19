import type { BlockContentWithDetails } from "~/models/blocks.server";
import type { BlockOptions } from "@prisma/client";
import { parseOptions } from "~/utility/parseOptions";
import parse from "html-react-parser";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  content: BlockContentWithDetails;
  options: BlockOptions[];
};

const TextBlock = ({ content, options: ArrayOptions }: Props) => {
  const { richText } = content || {};
  const options = ArrayOptions && ArrayOptions[0];
  const { backgroundColorPrimary, backgroundWidthPrimary, margin, size } =
    options || {};

  let blockSize;

  if (size === "small") {
    blockSize = "w-[920px]";
  } else if (size === "medium") {
    blockSize = "w-[1280px]";
  } else if (size === "large") {
    blockSize = "w-[1400px]";
  } else {
    blockSize = "w-[920px]";
  }

  return (
    <>
      {richText && (
        <div
          className={`!max-md:px-3 relative max-w-full py-3 max-xl:w-full ${blockSize} ${margin}`}
          style={{
            paddingTop: backgroundColorPrimary ? "3rem" : "unset",
            paddingBottom: backgroundColorPrimary ? "3rem" : "unset",
            paddingLeft: backgroundColorPrimary ? "1.5rem" : "unset",
            paddingRight: backgroundColorPrimary ? "1.5rem" : "unset",
          }}
        >
          <div
            className="absolute left-[50%] top-0 z-0 h-full w-screen translate-x-[-50%]"
            style={{
              backgroundColor: backgroundColorPrimary
                ? getThemeColorValueByName(backgroundColorPrimary)
                : "",
              width: backgroundWidthPrimary ? backgroundWidthPrimary : "unset",
            }}
          ></div>
          {parse(richText, parseOptions)}
        </div>
      )}
    </>
  );
};

export default TextBlock;

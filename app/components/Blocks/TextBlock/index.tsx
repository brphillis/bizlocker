import type { BlockContent } from "~/models/blocks.server";
import type { BlockOptions } from "@prisma/client";
import { parseOptions } from "~/utility/parseOptions";
import parse from "html-react-parser";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  content: BlockContent;
  options: BlockOptions[];
};

const TextBlock = ({ content, options: ArrayOptions }: Props) => {
  const { richText } = content || {};
  const options = ArrayOptions && ArrayOptions[0];
  const { backgroundColor, backgroundWidth, margin, size } = options || {};

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
            paddingTop: backgroundColor ? "3rem" : "unset",
            paddingBottom: backgroundColor ? "3rem" : "unset",
            paddingLeft: backgroundColor ? "1.5rem" : "unset",
            paddingRight: backgroundColor ? "1.5rem" : "unset",
          }}
        >
          <div
            className="absolute left-[50%] top-0 z-0 h-full w-screen translate-x-[-50%]"
            style={{
              backgroundColor: backgroundColor
                ? getThemeColorValueByName(backgroundColor)
                : "",
              width: backgroundWidth ? backgroundWidth : "unset",
            }}
          ></div>
          {parse(richText, parseOptions)}
        </div>
      )}
    </>
  );
};

export default TextBlock;

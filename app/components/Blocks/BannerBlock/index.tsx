import type { BlockOptions } from "@prisma/client";
import type { BlockContentWithDetails } from "~/models/blocks.server";
import { buildImageFromBlockContent } from "~/helpers/contentHelpers";
import ImageBanner from "./ImageBanner";
import TextBanner from "./TextBanner";

type Props = {
  content: BlockContentWithDetails;
  options?: BlockOptions[];
};

const BannerBlock = ({ content, options: ArrayOptions }: Props) => {
  const options = ArrayOptions && ArrayOptions[0];
  const {
    backgroundColorSecondary,
    borderDisplay,
    borderRadius,
    margin,
    padding,
    linkPrimary,
  } = options || {};

  const imageProps = buildImageFromBlockContent(
    content,
    "bannerImage",
    linkPrimary as string
  );

  const imageName = imageProps?.name;
  const imageLink = imageProps?.link;
  const imageSrc = imageProps?.imageSrc;

  return (
    <div
      className={`relative w-full max-w-[100vw] overflow-visible sm:w-max ${margin} ${padding} ${borderDisplay} ${borderRadius}`}
    >
      <div
        className={`absolute left-[50%] top-0 z-0 h-full w-screen translate-x-[-50%] ${backgroundColorSecondary}`}
      ></div>

      {imageSrc && imageName && options && (
        <ImageBanner
          imageAlt={imageName}
          imageLink={imageLink}
          imageSrc={imageSrc}
          options={options}
        />
      )}

      {!imageSrc && options && (
        <TextBanner imageLink={imageLink} options={options} />
      )}
    </div>
  );
};

export default BannerBlock;

import type { BlockOptions } from "@prisma/client";
import type { BlockContentSorted } from "~/models/blocks.server";
import {
  buildImageFromBlockContent,
  getContentType,
} from "~/helpers/contentHelpers";
import ImageBanner from "./ImageBanner";
import TextBanner from "./TextBanner";

type Props = {
  content: BlockContentSorted[];
  options?: BlockOptions[];
};

const BannerBlock = ({ content, options: ArrayOptions }: Props) => {
  const options = ArrayOptions && ArrayOptions[0];

  const {
    backgroundColorSecondary,
    borderDisplay,
    borderRadius,
    margin,
    linkPrimary,
  } = options || {};

  let imageName, imageLink, imageSrc;

  if (getContentType(content[0])) {
    const imageProps = buildImageFromBlockContent(
      content[0],
      "bannerImage",
      linkPrimary as string,
    );

    imageName = imageProps?.name;
    imageLink = imageProps?.link;
    imageSrc = imageProps?.imageSrc;
  }

  return (
    <div
      className={`relative max-md:w-full max-w-[100vw] overflow-visible w-max 
      ${margin} ${borderDisplay} ${borderRadius}`}
    >
      <div
        className={`absolute left-[50%] top-0 z-0 h-full w-screen translate-x-[-50%] ${backgroundColorSecondary}`}
      />

      <div className={`${backgroundColorSecondary ? "py-3" : ""}`}>
        {getContentType(content[0]) &&
          imageSrc &&
          imageName &&
          imageLink &&
          options && (
            <ImageBanner
              imageAlt={imageName}
              imageLink={imageLink}
              imageSrc={imageSrc}
              options={options}
            />
          )}

        {!getContentType(content[0]) && options && (
          <TextBanner imageLink={imageLink} options={options} />
        )}
      </div>
    </div>
  );
};

export default BannerBlock;

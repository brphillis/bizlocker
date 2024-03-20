import { BlockOptions } from "@prisma/client";
import { BlockContentSorted } from "~/models/Blocks/types";
import {
  buildImageFromBlockContent,
  getContentType,
} from "~/helpers/contentHelpers";
import TextBanner from "./TextBanner";
import ImageBanner from "./ImageBanner";

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
        {getContentType(content[0]) == null && options && (
          <TextBanner imageLink={imageLink} options={options} />
        )}

        {getContentType(content[0]) === "image" && options && (
          <ImageBanner
            imageAlt={imageName!}
            imageLink={imageLink!}
            imageSrc={imageSrc!}
            options={options}
          />
        )}
      </div>
    </div>
  );
};

export default BannerBlock;

import type { BlockOptions } from "@prisma/client";
import type { BlockContent } from "~/models/blocks.server";
import {
  buildContentImageFromContent,
  determineSingleContentType,
} from "~/helpers/blockContentHelpers";
import ImageBanner from "./ImageBanner";
import TextBanner from "./TextBanner";

type Props = {
  content: BlockContent;
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

  const contentType = determineSingleContentType(content as BlockContent);
  let imageName: string | null = null,
    imageLink: string | null = null,
    imageSrc: string | null = null;

  if (contentType) {
    const imageProps = buildContentImageFromContent(
      contentType!,
      content,
      "bannerImage",
      linkPrimary as string
    );
    imageName = imageProps.name;
    imageLink = imageProps.link;
    imageSrc = imageProps.imageSrc;
  }

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

import type { BlockContent } from "~/models/blocks.server";
import type { BlockOptions } from "@prisma/client";
import { ClientOnly } from "~/components/Client/ClientOnly";
import { concatBlockContent } from "~/helpers/blockContentHelpers";
import Carousel from "./Carousel/index.client";
import SEOCardSkeleton from "~/components/Client/Skeletons/SEOCardSkeleton";

type Props = {
  content: BlockContent;
  options: BlockOptions[];
};

const CarouselBlock = ({ content, options: ArrayOptions }: Props) => {
  const joinedContent = concatBlockContent(content);

  const {
    height,
    heightMobile,
    width,
    margin,
    padding,
    backgroundColor,
    backgroundDisplay,
    itemTitles,
  } = ArrayOptions[0];

  return (
    <ClientOnly
      fallback={
        <SEOCardSkeleton
          containerStyle={`${margin} ${padding} 
          ${height ? height : "h-[540px]"} 
          ${heightMobile ? heightMobile : "max-md:h-max"} 
          ${width ? width : "w-screen"}
          ${backgroundColor && backgroundDisplay && "my-6 max-md:my-0"}`}
          SEOWords={itemTitles}
        />
      }
    >
      {() => <Carousel options={ArrayOptions} joinedContent={joinedContent} />}
    </ClientOnly>
  );
};

export default CarouselBlock;

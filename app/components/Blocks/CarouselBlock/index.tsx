import { BlockOptions } from "@prisma/client";
import { ClientOnly } from "~/components/Client/ClientOnly";
import Carousel from "./Carousel/index.client";
import SEOCardSkeleton from "~/components/Client/Skeletons/SEOCardSkeleton";
import { BlockContentSorted } from "~/models/Blocks/types";

type Props = {
  content: BlockContentSorted[];
  options: BlockOptions[];
};

const CarouselBlock = ({ content, options: ArrayOptions }: Props) => {
  const {
    height,
    heightMobile,
    width,
    margin,
    padding,
    backgroundColorPrimary,
    backgroundDisplayPrimary,
    itemTitles,
  } = ArrayOptions?.[0] || {};

  return (
    <ClientOnly
      fallback={
        <SEOCardSkeleton
          containerStyle={`${margin} ${padding} 
          ${height ? height : "h-[540px]"} 
          ${heightMobile ? heightMobile : "max-md:h-max"} 
          ${width ? width : "w-screen"}
          ${
            backgroundColorPrimary &&
            backgroundDisplayPrimary &&
            "my-6 max-md:my-0"
          }`}
          SEOWords={itemTitles}
        />
      }
    >
      {() => <Carousel options={ArrayOptions?.[0]} content={content} />}
    </ClientOnly>
  );
};

export default CarouselBlock;

import type { BlockContent } from "~/models/blocks.server";
import type { BlockOptions } from "@prisma/client";
import { Suspense } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  buildContentImageFromContent,
  determineSingleContentType,
} from "~/helpers/blockContentHelpers";

type Props = {
  joinedContent: BlockContent[];
  options: BlockOptions[];
};

const Carousel = ({ joinedContent, options }: Props) => {
  const {
    margin,
    itemTitles,
    itemTitleColors,
    itemTitleSizes,
    itemTitleSizesMobile,
  } = options?.[0] || {};

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Swiper
        modules={[Navigation]}
        className={`!relative left-[50%] !z-0 h-[600px] w-screen translate-x-[-50%] ${margin}`}
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides={true}
        navigation
      >
        {joinedContent?.map((contentData: any, i: number) => {
          const contentType = determineSingleContentType(
            contentData as BlockContent
          );

          const { name, imageSrc } =
            buildContentImageFromContent(contentType!, contentData) || {};

          if (imageSrc) {
            return (
              <SwiperSlide key={i}>
                <div className="relative h-full w-full">
                  <div
                    className={`absolute left-[10%] top-[10%] text-brand-white/90 
                    ${itemTitleColors[i]} ${itemTitleSizes[i]} ${itemTitleSizesMobile[i]}`}
                  >
                    {itemTitles[i]}
                  </div>
                  <img
                    src={imageSrc}
                    alt={name || "image description placeholder"}
                    className="h-full w-full select-none object-cover object-[20%_50%]"
                  />
                </div>
              </SwiperSlide>
            );
          }
          return null;
        })}
      </Swiper>
    </Suspense>
  );
};

export default Carousel;

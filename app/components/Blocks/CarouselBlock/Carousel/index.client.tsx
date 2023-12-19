import type { BlockOptions } from "@prisma/client";
import type { BlockContent } from "~/models/blocks.server";
import { Suspense } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { isDecimal } from "~/helpers/numberHelpers";
import { getThemeColorValueByName } from "~/utility/colors";
import PatternBackground from "~/components/Layout/PatternBackground";
import {
  buildContentImageFromContent,
  determineSingleContentType,
} from "~/helpers/blockContentHelpers";
import Slide from "../Slide";

type Props = {
  joinedContent: BlockContent[];
  options: BlockOptions[];
};

const Carousel = ({ joinedContent, options }: Props) => {
  const {
    backgroundBrightness,
    backgroundColor,
    backgroundDisplay,
    backgroundPatternColor,
    backgroundPatternName,
    backgroundPatternOpacity,
    backgroundPatternSize,
    backgroundWidth,
    columns,
    columnsMobile,
    margin,
    padding,
    size,
  } = options?.[0] || {};

  // we generate enough slides for the loop functionality
  const generateSlidesForPartialViews = (arr: any[]): any[] => {
    if (!Array.isArray(arr)) {
      throw new Error("Input is not an array");
    }

    if (columns && isDecimal(columns) && arr.length < columns * 3) {
      const originalLength = arr.length;
      const newArray = new Array(originalLength * 2);

      for (let i = 0; i < originalLength; i++) {
        newArray[i] = arr[i];
        newArray[i + originalLength] = arr[i];
      }

      return newArray;
    } else return arr;
  };

  return (
    <div
      className={`relative 
      ${backgroundColor ? "py-6" : "p-0"} 
      ${margin} ${padding}`}
    >
      <PatternBackground
        name={backgroundPatternName as BackgroundPatternName}
        backgroundColor={getThemeColorValueByName(backgroundColor)}
        patternColor={getThemeColorValueByName(backgroundPatternColor)}
        patternOpacity={backgroundPatternOpacity || 0.5}
        patternSize={backgroundPatternSize || 32}
        screenWidth={backgroundWidth === "100vw" ? true : false}
        brightness={backgroundBrightness || undefined}
        displayStyle={backgroundDisplay}
      />

      <Suspense fallback={<div>Loading...</div>}>
        <Swiper
          modules={[Pagination]}
          className={`!relative left-[50%] !z-0 w-screen translate-x-[-50%] 
          ${size ? size : "h-[540px]"}`}
          slidesPerView={columns || 1}
          spaceBetween={20}
          centeredSlides={true}
          loop={true}
          pagination={true}
          breakpoints={{
            768: {
              slidesPerView: columns || 1,
            },
            0: {
              slidesPerView: columnsMobile || 1,
            },
          }}
          style={{
            // @ts-ignore
            "--swiper-pagination-color": "#FFFFFF",
            "--swiper-pagination-bullet-border-radius": "0px",
            "--swiper-pagination-bullet-inactive-color": "#999999",
            "--swiper-pagination-bullet-inactive-opacity": "1",
            "--swiper-pagination-bullet-horizontal-gap": "6px",
            "--swiper-pagination-bullet-width": "18px",
            "--swiper-pagination-bullet-height": "4px",
            // --swiper-pagination-left: auto;
            // --swiper-pagination-right: 8px;
            // --swiper-pagination-bottom: 8px;
            // --swiper-pagination-top: auto;
          }}
        >
          {generateSlidesForPartialViews(joinedContent)?.map(
            (contentData: any, i: number) => {
              const index =
                i + 1 > joinedContent.length ? i - joinedContent.length : i;

              const contentType = determineSingleContentType(
                contentData as BlockContent
              );

              const { name, imageSrc } =
                buildContentImageFromContent(contentType!, contentData) || {};

              return (
                <SwiperSlide key={i}>
                  <Slide
                    index={index}
                    blockOptions={options?.[0]}
                    image={{ altText: name, src: imageSrc }}
                  />
                </SwiperSlide>
              );
            }
          )}
        </Swiper>
      </Suspense>
    </div>
  );
};

export default Carousel;

import type { BlockOptions } from "@prisma/client";
import type { BlockContent } from "~/models/blocks.server";
import { Suspense } from "react";
import { Navigation } from "swiper/modules";
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
          modules={[Navigation]}
          className={`!relative left-[50%] !z-0 h-[540px] w-screen translate-x-[-50%]`}
          slidesPerView={columns || 1}
          spaceBetween={20}
          centeredSlides={true}
          loop={true}
          pagination={true}
          navigation
          breakpoints={{
            768: {
              slidesPerView: columns || 1,
            },
            0: {
              slidesPerView: columnsMobile || 1,
            },
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

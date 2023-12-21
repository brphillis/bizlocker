import type { BlockOptions } from "@prisma/client";
import type { BlockContent } from "~/models/blocks.server";
import { Suspense } from "react";
import { Pagination, Autoplay } from "swiper/modules";
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
    height,
    heightMobile,
    width,
    speed,
    autoplay,
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

  let swiperModules = [Pagination];

  if (autoplay) {
    swiperModules.push(Autoplay);
  }

  // remove any extra pagination buttons created from generateSlidesForPartialViews and swiper
  const hideExtraPaginationButtons = () => {
    if (columns && isDecimal(columns) && joinedContent.length < columns * 3) {
      const paginationButtons = document.querySelectorAll(
        ".swiper-pagination-bullet"
      );

      paginationButtons.forEach((button, index: number) => {
        const relativeIndex = index + 1;

        if (relativeIndex > joinedContent.length) {
          button.remove();
        }
      });
    }
  };

  return (
    <div
      className={`relative 
      ${backgroundColor ? "py-6" : "p-0"} 
      ${width ? width : "w-screen"}
      ${margin} ${padding}
      ${
        backgroundColor && backgroundWidth !== "w-screen" && "px-6 max-md:px-0"
      }`}
    >
      <PatternBackground
        name={backgroundPatternName as BackgroundPatternName}
        backgroundColor={getThemeColorValueByName(backgroundColor)}
        patternColor={getThemeColorValueByName(backgroundPatternColor)}
        patternOpacity={backgroundPatternOpacity || 0.5}
        patternSize={backgroundPatternSize || 32}
        screenWidth={backgroundWidth === "w-screen" ? true : false}
        brightness={backgroundBrightness || undefined}
        displayStyle={backgroundDisplay}
      />

      <Suspense fallback={<div></div>}>
        <div
          className={`!relative left-[50%] !z-0 translate-x-[-50%] 
          ${height ? height : "h-[540px]"}
          ${heightMobile ? heightMobile : "max-md:h-max"}
          `}
        >
          <Swiper
            modules={swiperModules}
            className="h-full w-full"
            slidesPerView={columns || 1}
            spaceBetween={20}
            centeredSlides={true}
            loop={true}
            pagination={true}
            onInit={hideExtraPaginationButtons}
            autoplay={{
              delay: speed || 0,
              pauseOnMouseEnter: true,
            }}
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
        </div>
      </Suspense>
    </div>
  );
};

export default Carousel;

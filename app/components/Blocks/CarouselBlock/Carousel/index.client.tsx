import { Suspense } from "react";
import { BlockOptions } from "@prisma/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { isDecimal } from "~/helpers/numberHelpers";
import { getThemeColorValueByName } from "~/utility/colors";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { buildImageFromBlockContent } from "~/helpers/contentHelpers";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { BlockContentSorted } from "~/models/Blocks/types";

import Slide from "../Slide";

type Props = {
  content: BlockContentSorted[];
  options: BlockOptions;
};

const Carousel = ({ content, options }: Props) => {
  const {
    backgroundBrightnessPrimary,
    backgroundColorPrimary,
    backgroundDisplayPrimary,
    backgroundPatternColorPrimary,
    backgroundPatternNamePrimary,
    backgroundPatternSizePrimary,
    backgroundWidthPrimary,
    numberColumns,
    numberColumnsMobile,
    margin,
    padding,
    height,
    heightMobile,
    width,
    speed,
    autoplay,
  } = options || {};

  const trueSlideLength = content.length;

  // we generate enough slides for the loop functionality
  const generateSlidesForPartialViews = (
    arr: BlockContentSorted[],
  ): BlockContentSorted[] => {
    if (!Array.isArray(arr)) {
      throw new Error("Input is not an array");
    }

    if (
      numberColumns &&
      isDecimal(numberColumns) &&
      arr.length < numberColumns * 3
    ) {
      const originalLength = arr.length;
      const newArray = new Array(originalLength * 2);

      for (let i = 0; i < originalLength; i++) {
        newArray[i] = arr[i];
        newArray[i + originalLength] = arr[i];
      }

      return newArray;
    } else return arr;
  };

  const swiperModules = [Pagination, Navigation];

  if (autoplay) {
    swiperModules.push(Autoplay);
  }

  // remove any extra pagination buttons created from generateSlidesForPartialViews and swiper
  const hideExtraPaginationButtons = () => {
    if (
      numberColumns &&
      isDecimal(numberColumns) &&
      trueSlideLength < numberColumns * 3
    ) {
      const paginationButtons = document.querySelectorAll(
        ".swiper-pagination-bullet",
      );

      paginationButtons.forEach((button, index: number) => {
        const relativeIndex = index + 1;

        if (relativeIndex > trueSlideLength) {
          button.remove();
        }
      });
    }
  };

  return (
    <div
      className={`relative shadow-md
      ${backgroundColorPrimary ? "py-6" : "p-0"} 
      ${
        backgroundColorPrimary && backgroundDisplayPrimary === "max-md:hidden"
          ? "max-md:py-0"
          : ""
      }
      ${
        backgroundColorPrimary &&
        backgroundDisplayPrimary === "max-md:block hidden"
          ? "!py-0 max-md:!py-6"
          : ""
      }
      ${width ? width : "w-screen"}
      ${margin} ${backgroundColorPrimary ? padding : ""}
      ${
        backgroundColorPrimary &&
        backgroundWidthPrimary !== "w-screen" &&
        "px-6 max-md:px-0"
      }`}
    >
      <PatternBackground
        name={backgroundPatternNamePrimary as BackgroundPatternName}
        backgroundColor={getThemeColorValueByName(backgroundColorPrimary)}
        patternColor={getThemeColorValueByName(backgroundPatternColorPrimary)}
        patternSize={backgroundPatternSizePrimary || 32}
        screenWidth={backgroundWidthPrimary === "w-screen" ? true : false}
        brightness={backgroundBrightnessPrimary || undefined}
        displayStyle={backgroundDisplayPrimary}
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
            className="relative h-full w-full"
            slidesPerView={numberColumns || 1}
            spaceBetween={20}
            centeredSlides={true}
            loop={true}
            pagination={true}
            navigation={{
              nextEl: ".carouselNavNextButton",
              prevEl: ".carouselNavPrevButton",
            }}
            onInit={hideExtraPaginationButtons}
            onSlideChange={(e) => {
              //handle pagination active class
              const paginationButtons = document.querySelectorAll(
                ".swiper-pagination-bullet",
              );

              if (
                paginationButtons?.[e.realIndex - trueSlideLength] &&
                e.realIndex + 1 > trueSlideLength
              ) {
                paginationButtons[e.realIndex - trueSlideLength].classList.add(
                  "swiper-pagination-bullet-active",
                );
              }
            }}
            slideNextClass="blur-sm"
            onSlideNextTransitionEnd={(e) => {
              e.slides.forEach((e) => {
                if (!e.className.includes("swiper-slide-active")) {
                  e.classList.add("blur-sm");
                }
              });
            }}
            slidePrevClass="blur-sm"
            onSlidePrevTransitionEnd={(e) => {
              e.slides.forEach((e) => {
                if (!e.className.includes("swiper-slide-active")) {
                  e.classList.add("blur-sm");
                }
              });
            }}
            autoplay={{
              delay: speed || 0,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              768: {
                slidesPerView: numberColumns || 1,
              },
              0: {
                slidesPerView: numberColumnsMobile || 1,
              },
            }}
            style={{
              // @ts-expect-error: CSS Variables from Swiper Libary Override
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
            <div className="carouselNavPrevButton absolute left-0 top-[50%] z-10 flex h-full translate-y-[-50%] cursor-pointer items-center justify-center bg-brand-black/50 p-6 text-brand-white transition-colors duration-300 hover:bg-brand-black/40 max-md:hidden">
              <IoChevronBackOutline size={30} />
            </div>
            <div className="carouselNavNextButton absolute right-0 top-[50%] z-10 flex h-full translate-y-[-50%] cursor-pointer items-center justify-center bg-brand-black/50 p-6 text-brand-white transition-colors duration-300 hover:bg-brand-black/40 max-md:hidden">
              <IoChevronForward size={30} />
            </div>

            {generateSlidesForPartialViews(content)?.map(
              (contentData: BlockContentSorted, i: number) => {
                const index = i + 1 > trueSlideLength ? i - trueSlideLength : i;

                const { name, imageSrc } =
                  buildImageFromBlockContent(contentData) || {};

                return (
                  <SwiperSlide key={i}>
                    <Slide
                      index={index}
                      blockOptions={options}
                      image={{ altText: name, src: imageSrc }}
                    />
                  </SwiperSlide>
                );
              },
            )}
          </Swiper>
        </div>
      </Suspense>
    </div>
  );
};

export default Carousel;

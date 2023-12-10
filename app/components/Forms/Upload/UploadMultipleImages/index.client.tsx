import React, { Suspense, useState } from "react";
import type { Image } from "@prisma/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { ConvertToBase64Image, type NewImage } from "~/helpers/fileHelpers";
import { IoClose } from "react-icons/io5";
import { findFirstNotNullInputValue } from "~/helpers/formHelpers";

type ImageUploadSliderProps = {
  defaultImages: Image[] | undefined;
};

const UploadMultipleImages = ({ defaultImages }: ImageUploadSliderProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [images, setCurrentImages] = useState<Image[] | NewImage[] | undefined>(
    defaultImages
  );

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...(images || [])];
    updatedImages.splice(index, 1);
    setCurrentImages(updatedImages as Image[]);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="text-center">Upload Images</div>
      {images && images?.some((image) => image) ? (
        <Swiper
          modules={[Navigation]}
          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          className="mx-auto mt-6 block h-max w-full"
          spaceBetween={12}
          slidesPerView={1}
          centeredSlides={true}
          navigation
        >
          {images?.map(({ href, altText }: Image | NewImage, i) => {
            if (href) {
              return (
                <SwiperSlide key={i}>
                  <div className="relative mx-auto block max-w-[200px] rounded-lg">
                    <IoClose
                      size={20}
                      className="
                        absolute right-2 top-2
                        -mr-2 -mt-2 cursor-pointer
                        rounded-bl-md bg-primary p-[0.2rem] text-white
                      "
                      onClick={() => handleRemoveImage(i)}
                    />
                    <img
                      src={href}
                      alt={altText || "image description placeholder"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              );
            }
            return null;
          })}
        </Swiper>
      ) : null}

      <div className="form-control my-6 w-[495px] max-w-[95vw] items-center gap-3 self-center sm:items-start">
        <div className="flex w-full flex-row justify-center gap-6">
          {Array.from({ length: 5 }).map((_, i) => {
            const image = images?.[i] || null;
            return (
              <React.Fragment key={i}>
                <input
                  type="file"
                  id={`image${i + 1}`}
                  accept="image/*"
                  className="file-input file-input-bordered hidden w-full"
                  onChange={async (e) => {
                    const convertedImage = await ConvertToBase64Image(e);
                    if (convertedImage) {
                      const updatedImages = [...(images || [])];
                      updatedImages[i] = convertedImage;
                      if (updatedImages[i]?.altText?.includes(".") || null) {
                        const nameSelector = findFirstNotNullInputValue("name");
                        const titleSelector =
                          findFirstNotNullInputValue("title");
                        const altTextSelector =
                          findFirstNotNullInputValue("altText");

                        if (nameSelector) {
                          updatedImages[i].altText =
                            nameSelector.value + " " + i;
                        } else if (titleSelector) {
                          updatedImages[i].altText =
                            titleSelector.value + " " + i;
                        } else if (altTextSelector) {
                          updatedImages[i].altText =
                            altTextSelector.value + " " + i;
                        }
                      }
                      setCurrentImages(updatedImages as Image[]);
                    }
                  }}
                />
                <label
                  htmlFor={`image${i + 1}`}
                  className={`h-4 w-4 cursor-pointer rounded-full ${
                    image ? "bg-success" : "bg-gray-500"
                  }
                  ${
                    activeSlide === i &&
                    "border-none outline outline-[4px] outline-success"
                  }
                  `}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <input
        hidden
        readOnly
        name="images"
        value={JSON.stringify(images) || ""}
      />
    </Suspense>
  );
};

export default UploadMultipleImages;

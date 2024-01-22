import { type ChangeEvent, Suspense, useState, useEffect } from "react";
import type { Image } from "@prisma/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ConvertToBase64Image, type NewImage } from "~/helpers/fileHelpers";
import { IoClose } from "react-icons/io5";
import { findFirstNotNullInputValue } from "~/helpers/formHelpers";
import Icon from "~/components/Icon";

type ImageUploadSliderProps = {
  defaultImages?: Image[] | null;
};

const UploadMultipleImages = ({ defaultImages }: ImageUploadSliderProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [images, setCurrentImages] = useState<Image[] | NewImage[] | null>(
    defaultImages || null,
  );

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...(images || [])];
    updatedImages.splice(index, 1);
    setCurrentImages(updatedImages as Image[]);
  };

  const handleAddImage = async (
    inputEvent: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const convertedImage = await ConvertToBase64Image(inputEvent);

    if (convertedImage) {
      let updatedImages = images ? [...images] : [];

      updatedImages[index] = convertedImage;

      if (updatedImages[index]?.altText?.includes(".") || null) {
        const nameSelector = findFirstNotNullInputValue("name");
        const titleSelector = findFirstNotNullInputValue("title");
        const altTextSelector = findFirstNotNullInputValue("altText");

        if (nameSelector) {
          updatedImages[index].altText = nameSelector.value + " " + index;
        } else if (titleSelector) {
          updatedImages[index].altText = titleSelector.value + " " + index;
        } else if (altTextSelector) {
          updatedImages[index].altText = altTextSelector.value + " " + index;
        }
      }

      //sanitize array of empty objects
      updatedImages = updatedImages.filter((e) => e !== undefined);

      setCurrentImages(updatedImages as Image[]);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="text-center">Upload Images</div>

      {/* // FOCUSED IMAGE */}
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
                      className="h-full w-full select-none object-cover"
                    />
                  </div>
                </SwiperSlide>
              );
            }
            return null;
          })}
        </Swiper>
      ) : null}

      {/* BOTTOM IMAGES */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {images?.map(({ href, altText }: Image | NewImage, i: number) => {
          return (
            <label
              key={"uploadMultipleImages_BottomImage_" + i}
              htmlFor={`image${i + 1}`}
              className={`h-20 w-20 cursor-pointer rounded-full
                  ${
                    activeSlide === i &&
                    "scale-[1.1] transition-transform duration-300"
                  }
                  `}
            >
              <img
                src={href || ""}
                alt={altText || "image description placeholder"}
                className="h-full w-full object-cover"
              />

              <input
                type="file"
                id={`image${i + 1}`}
                accept="image/*"
                className="file-input file-input-bordered hidden h-full w-full"
                onChange={async (e) => {
                  handleAddImage(e, i);
                }}
              />
            </label>
          );
        })}

        {/*  ADD BUTTON */}
        <label
          className="trnasition-colors group flex h-20 w-20 cursor-pointer items-center justify-center border-[1px] border-primary bg-none duration-700 hover:border-none hover:bg-primary"
          htmlFor="UploadMultipleImages_NewImage"
        >
          <input
            id="UploadMultipleImages_NewImage"
            type="file"
            accept="image/*"
            className="file-input file-input-bordered hidden h-full w-full"
            onChange={async (e) => {
              const indexToAdd =
                images && images.length ? images.length + 1 : 0;
              handleAddImage(e, indexToAdd);
            }}
          />
          <Icon
            iconName="IoAdd"
            size={36}
            extendStyle="text-primary group-hover:text-brand-white"
          />
        </label>
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

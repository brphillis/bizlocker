import React, { Suspense, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { ConvertToBase64 } from "~/utility/fileHelpers";

type ImageUploadSliderProps = {
  defaultImages: Image[] | undefined;
};

const ImageUploadSlider = ({ defaultImages }: ImageUploadSliderProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [images, setCurrentImages] = useState<Image[] | undefined>(
    defaultImages
  );
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {images && images?.some((image) => image) ? (
        <Swiper
          modules={[Navigation]}
          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          className="mx-auto mt-10 block h-max w-full"
          spaceBetween={12}
          slidesPerView={1}
          centeredSlides={true}
          navigation
        >
          {images?.map((image, i) => {
            if (image?.url) {
              return (
                <SwiperSlide key={i}>
                  <img
                    src={image.url}
                    alt={image.altText}
                    className="mx-auto block max-w-[320px] rounded-lg object-cover"
                  />
                </SwiperSlide>
              );
            }
            return null; // Skip undefined elements
          })}
        </Swiper>
      ) : null}

      <div className="form-control my-6 w-[495px] max-w-[95vw] items-center gap-3 self-center sm:items-start">
        <div className="flex w-full flex-row justify-center gap-6">
          {Array.from({ length: 3 }).map((_, i) => {
            const image = images?.[i] || null;
            return (
              <React.Fragment key={i}>
                <input
                  type="file"
                  id={`image${i + 1}`}
                  accept="image/*"
                  className="file-input-bordered file-input hidden w-full"
                  onChange={async (e) => {
                    const convertedImage = await ConvertToBase64(e);
                    if (convertedImage) {
                      const updatedImages = [...(images || [])];
                      updatedImages[i] = convertedImage;
                      setCurrentImages(updatedImages);
                    }
                  }}
                />
                <label
                  htmlFor={`image${i + 1}`}
                  className={`btn ${image && "btn-success"} ${
                    activeSlide === i &&
                    "border-none outline outline-[4px] outline-success"
                  }`}
                >
                  Image {i + 1}
                </label>
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

export default ImageUploadSlider;

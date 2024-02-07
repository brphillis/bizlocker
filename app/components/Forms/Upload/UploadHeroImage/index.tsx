import { Image } from "@prisma/client";
import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { ConvertToBase64Image, type NewImage } from "~/helpers/fileHelpers";
import { getBucketImageSrc } from "~/integrations/_master/storage";
import { ProductWithDetails } from "~/models/Products/types";

type Props = {
  valueToChange: ProductWithDetails;
};

const UploadHeroImage = ({ valueToChange }: Props) => {
  const [heroImage, setHeroImage] = useState<
    Image | NewImage | null | undefined
  >(valueToChange?.heroImage);

  return (
    <div className="collapse collapse-arrow mt-6 rounded-none bg-base-100">
      <input type="checkbox" />
      <div className="collapse-title ml-3 mt-1 h-max text-center text-sm font-medium">
        Hero Image
      </div>
      <div className="collapse-content">
        <div className="flex flex-col items-center">
          <div className="text-center text-xs">Optimal Transparent Square</div>

          {heroImage?.href && (
            <div className="relative mt-3 flex flex-col items-center">
              <div className="relative h-max w-max">
                <img
                  src={getBucketImageSrc(heroImage.href)}
                  className="my-3 h-36 max-w-[280px] rounded-lg object-contain sm:max-w-[30rem]"
                  alt="brandImageEditor"
                />

                <IoIosCloseCircle
                  onClick={() => setHeroImage(undefined)}
                  size={18}
                  className="absolute right-0 top-0 -mr-2 mt-1 cursor-pointer rounded-full bg-brand-white text-primary"
                />
              </div>
            </div>
          )}

          <input
            name="tileImageUpload"
            type="file"
            accept="image/*"
            className="file-input file-input-bordered mt-3 w-[120px] bg-primary/50 text-brand-white sm:w-[440px]"
            onChange={async (e) => {
              const convertedImage = await ConvertToBase64Image(e);
              convertedImage && setHeroImage(convertedImage);
            }}
          />

          <input
            type="hidden"
            name="heroImage"
            value={JSON.stringify(heroImage) || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadHeroImage;

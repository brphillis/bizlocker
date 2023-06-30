import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { ConvertToBase64 } from "~/utility/fileHelpers";

type Props = {
  valueToChange: Campaign | Promotion;
};

const UploadBannerImage = ({ valueToChange }: Props) => {
  const [bannerImage, setBannerImage] = useState<Image | undefined>(
    valueToChange?.bannerImage
  );

  return (
    <div className="collapse-arrow collapse mt-6 rounded-none bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title ml-3 mt-1 h-max text-center text-sm font-medium">
        Banner Image
      </div>
      <div className="collapse-content">
        <div className="flex flex-col items-center">
          <div className="text-center text-xs">Optimal 8.09:1 Aspect Ratio</div>

          {bannerImage && (
            <div className="relative mt-3 flex flex-col items-center">
              <div className="relative h-max w-max">
                <img
                  src={valueToChange.bannerImage.url}
                  className="my-3 h-36 max-w-[280px] rounded-lg object-contain sm:max-w-[30rem]"
                  alt="brandImageEditor"
                />

                <IoIosCloseCircle
                  onClick={() => setBannerImage(undefined)}
                  size={18}
                  className="absolute right-0 top-0 -mr-2 mt-1 cursor-pointer rounded-full bg-white text-primary"
                />
              </div>
            </div>
          )}

          <input
            name="bannerImageUpload"
            type="file"
            accept="image/*"
            className="file-input-bordered file-input mt-3 w-[120px] sm:w-[440px]"
            onChange={async (e) => {
              const convertedImage = await ConvertToBase64(e);
              convertedImage && setBannerImage(convertedImage);
            }}
          />
          <input
            type="hidden"
            name="bannerImage"
            value={JSON.stringify(bannerImage) || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadBannerImage;

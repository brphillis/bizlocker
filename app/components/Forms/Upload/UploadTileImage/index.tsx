import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { ConvertToBase64 } from "~/utility/fileHelpers";

type Props = {
  valueToChange: Campaign | Promotion;
};

const UploadTileImage = ({ valueToChange }: Props) => {
  const [tileImage, setTileImage] = useState<Image | undefined>(
    valueToChange?.tileImage
  );

  return (
    <div className="collapse-arrow collapse mt-6 rounded-none bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title ml-3 mt-1 h-max text-center text-sm font-medium">
        Tile Image
      </div>
      <div className="collapse-content">
        <div className="flex flex-col items-center">
          <div className="text-center text-xs">Optimal Square Image</div>

          {tileImage && (
            <div className="relative mt-3 flex flex-col items-center">
              <div className="relative h-max w-max">
                <img
                  src={tileImage.url}
                  className="my-3 h-36 max-w-[280px] rounded-lg object-contain sm:max-w-[30rem]"
                  alt="brandImageEditor"
                />

                <IoIosCloseCircle
                  onClick={() => setTileImage(undefined)}
                  size={18}
                  className="absolute right-0 top-0 -mr-2 mt-1 cursor-pointer rounded-full bg-white text-primary"
                />
              </div>
            </div>
          )}

          <input
            name="tileImageUpload"
            type="file"
            accept="image/*"
            className="file-input-bordered file-input mt-3 w-[120px] sm:w-[440px]"
            onChange={async (e) => {
              const convertedImage = await ConvertToBase64(e);
              convertedImage && setTileImage(convertedImage);
            }}
          />
          <input
            type="hidden"
            name="tileImage"
            value={JSON.stringify(tileImage) || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadTileImage;

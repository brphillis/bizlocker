import type { Image } from "@prisma/client";
import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { ConvertToBase64Image, type NewImage } from "~/helpers/fileHelpers";
import { getBucketImageSrc } from "~/integrations/_master/storage";

type Props = {
  label: string;
  name: string;
  tooltip: string;
  defaultValue?: Image | null;
};

const UploadImageCollapse = ({ label, name, tooltip, defaultValue }: Props) => {
  const [image, setImage] = useState<Image | NewImage | undefined>(
    defaultValue || undefined,
  );

  console.log(image);

  return (
    <div className="collapse collapse-arrow mt-6 rounded-none bg-base-100">
      <input type="checkbox" />
      <div className="collapse-title ml-3 mt-1 h-max text-center text-sm font-medium">
        {label}
      </div>
      <div className="collapse-content">
        <div className="flex flex-col items-center">
          <div className="text-center text-xs">{tooltip}</div>

          {image?.href && (
            <div className="relative mt-3 flex flex-col items-center">
              <div className="relative h-max w-max">
                <img
                  src={
                    image.href.includes("data:image")
                      ? image.href
                      : getBucketImageSrc(image.href)
                  }
                  className="my-3 h-36 max-w-[280px] rounded-lg object-contain sm:max-w-[30rem]"
                  alt="brandImageEditor"
                />

                <IoIosCloseCircle
                  onClick={() => setImage(undefined)}
                  size={18}
                  className="absolute right-0 top-0 -mr-2 mt-1 cursor-pointer rounded-full bg-white text-primary"
                />
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered mt-3 w-[120px] bg-primary/50 text-brand-white sm:w-[440px]"
            onChange={async (e) => {
              const convertedImage = await ConvertToBase64Image(e);
              convertedImage && setImage(convertedImage);
            }}
          />

          <input
            type="hidden"
            name={name}
            value={JSON.stringify(image) || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadImageCollapse;

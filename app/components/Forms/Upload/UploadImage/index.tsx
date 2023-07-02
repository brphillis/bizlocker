import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { ConvertToBase64 } from "~/utility/fileHelpers";

type Props = {
  defaultValue: Image | undefined | null;
};

const UploadImage = ({ defaultValue }: Props) => {
  const [image, setImage] = useState<Image | undefined>(
    defaultValue || undefined
  );

  return (
    <>
      {image && (
        <div className="relative my-6 flex flex-col items-center">
          <div className="relative h-max w-max">
            <img
              src={image.url}
              className="h-36 w-36 rounded-lg object-cover"
              alt="brandImageEditor"
            />

            <IoIosCloseCircle
              onClick={() => setImage(undefined)}
              size={28}
              className="
                  absolute right-0 top-0
                  -mr-2 -mt-2 cursor-pointer
                  rounded-full bg-white text-primary
                "
            />
          </div>
        </div>
      )}

      <input
        name="imageUpload"
        type="file"
        accept="image/*"
        className="file-input-bordered file-input w-full"
        onChange={async (e) => {
          const convertedImage = await ConvertToBase64(e);
          convertedImage && setImage(convertedImage);
        }}
      />
      <input type="hidden" name="image" value={JSON.stringify(image) || ""} />
    </>
  );
};

export default UploadImage;

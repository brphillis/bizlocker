import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { ConvertToBase64 } from "~/utility/fileHelpers";

type Props = {
  defaultValue: Image | undefined | null;
  name?: string;
};

const UploadImage = ({ defaultValue, name }: Props) => {
  const [image, setImage] = useState<Image | undefined>(
    defaultValue || undefined
  );

  return (
    <>
      {image && (
        <div className="relative mb-3 mt-6 flex flex-col items-center">
          <div className="relative h-max w-max">
            <img
              src={image.url}
              className="h-36 w-auto rounded-lg object-cover"
              alt="brandImageEditor"
            />

            <IoClose
              onClick={() => setImage(undefined)}
              size={18}
              className="
                  absolute right-0 top-0 -mr-2
                  -mt-2 cursor-pointer rounded-full
                  bg-primary p-[0.2rem] text-white
                "
            />
          </div>
        </div>
      )}

      {!image && (
        <input
          name="imageUpload"
          type="file"
          accept="image/*"
          className="file-input-bordered file-input w-full rounded-none"
          onChange={async (e) => {
            const convertedImage = await ConvertToBase64(e);
            convertedImage && setImage(convertedImage);
          }}
        />
      )}
      <input
        type="hidden"
        name={name ? name : "image"}
        value={JSON.stringify(image) || ""}
      />
    </>
  );
};

export default UploadImage;

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { ConvertToBase64 } from "~/utility/fileHelpers";
import { findFirstNotNullInputValue } from "~/utility/formHelpers";

type Props = {
  defaultValue: Image | undefined | null;
  name?: string;
  label?: string;
};

const UploadImage = ({ defaultValue, name, label }: Props) => {
  const [image, setImage] = useState<Image | undefined>(
    defaultValue || undefined
  );

  return (
    <>
      {label && <label className="label text-sm">{label}</label>}
      {image && (
        <div className="relative my-6 flex max-w-full flex-col items-center">
          <div className="relative h-max w-max max-w-full">
            <img
              src={image.url}
              className="max-w-screen h-auto max-h-96 w-[400px] object-contain"
              alt={image.altText}
            />

            <IoClose
              onClick={() => setImage(undefined)}
              size={18}
              className="
              absolute right-2 top-2
              -mr-2 -mt-2 cursor-pointer
              rounded-bl-md bg-primary p-[0.2rem] text-white
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
          className="file-input file-input-bordered w-full rounded-none bg-primary/50 text-brand-white"
          onChange={async (e) => {
            const convertedImage = await ConvertToBase64(e);

            if (
              (convertedImage?.altText?.includes(".") || null) &&
              convertedImage
            ) {
              const nameSelector = findFirstNotNullInputValue("name");
              const titleSelector = findFirstNotNullInputValue("title");
              const altTextSelector = findFirstNotNullInputValue("altText");

              if (nameSelector) {
                convertedImage.altText = nameSelector.value;
              } else if (titleSelector) {
                convertedImage.altText = titleSelector.value;
              } else if (altTextSelector) {
                convertedImage.altText = altTextSelector.value;
              }
            }

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

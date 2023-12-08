import type { Image } from "@prisma/client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { ConvertToBase64Image } from "~/helpers/fileHelpers";
import { findFirstNotNullInputValue } from "~/helpers/formHelpers";

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
      {image?.href && (
        <div className="relative my-6 flex max-w-full flex-col items-center px-3">
          <div className="max-w-screen relative h-auto max-h-96 w-[240px]">
            <img
              src={image.href}
              className="h-full w-full object-contain"
              alt={image?.altText || "image description placeholder"}
            />

            <IoClose
              onClick={() => setImage(undefined)}
              size={18}
              className="
              absolute right-2 top-2
              -mr-3 -mt-3 cursor-pointer
              rounded-sm bg-primary p-[0.2rem] text-white
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
            const convertedImage = await ConvertToBase64Image(e);

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

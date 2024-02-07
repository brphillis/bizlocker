import type { Image } from "@prisma/client";
import { useState } from "react";
import { ConvertToBase64Image, type NewImage } from "~/helpers/fileHelpers";
import { getBucketImageSrc } from "~/integrations/_master/storage";
import { placeholderAvatar } from "~/utility/placeholderAvatar";

type Props = {
  avatar: Image | undefined | null;
};

const UploadAvatar = ({ avatar }: Props) => {
  const [image, setImage] = useState<NewImage | Image | undefined>(
    avatar || undefined,
  );

  return (
    <>
      <div className="flex items-center justify-center gap-6 py-1">
        <div className="avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 sm:w-32">
            <img
              src={
                (image?.href && getBucketImageSrc(image?.href)) ||
                placeholderAvatar?.href ||
                undefined
              }
              alt="user_avatar"
            />
          </div>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full max-w-[50vw] bg-primary/50 text-brand-white"
            onChange={async (e) => {
              const convertedImage = await ConvertToBase64Image(e);
              convertedImage && setImage(convertedImage);
            }}
          />
        </div>
        <input
          type="hidden"
          name="avatar"
          value={JSON.stringify(image) || ""}
        />
      </div>
      <div className="divider mt-0 mb-0 w-full" />
    </>
  );
};

export default UploadAvatar;

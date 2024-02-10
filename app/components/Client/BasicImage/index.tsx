import { useState, useEffect } from "react";
import { getBucketImageSrc } from "~/integrations/_master/storage";

type Props = {
  onClick?: () => void;
  src: string;
  alt: string;
  extendStyle?: string;
  hoverEffect?: "grow";
};

const BasicImage = ({ src, alt, onClick, extendStyle, hoverEffect }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const image = new Image();
    image.src = getBucketImageSrc(src);
    console.log("SRC", src);
    image.onload = () => {
      setLoading(false);
    };

    return () => {
      image.onload = null;
    };
  }, [src]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick && onClick()}
      onKeyDown={() => onClick && onClick()}
      className={`relative h-full w-full`}
    >
      <img
        className={`h-full w-full object-cover
            ${loading ? "hidden" : "block"}
            ${extendStyle ? extendStyle : ""}
            ${hoverEffect ? "hover:scale-[1.025]" : ""}
            `}
        src={getBucketImageSrc(src)}
        alt={alt}
      />
      {loading && (
        <div
          className={`skeleton flex !h-full !w-full items-center justify-center text-brand-white/10 !rounded-none ${extendStyle}`}
        >
          <p>{alt}</p>
        </div>
      )}
    </div>
  );
};

export default BasicImage;

import { useState, useEffect } from "react";

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
    image.src = src;

    image.onload = () => {
      setLoading(false);
    };

    return () => {
      image.onload = null;
    };
  }, [src]);

  return (
    <button
      type="button"
      onClick={() => onClick && onClick()}
      className={`relative h-full w-full`}
    >
      <img
        className={` 
            ${loading ? "hidden" : "block"}
            ${extendStyle ? extendStyle : ""}
            ${hoverEffect ? "hover:scale-[1.025]" : ""}
            `}
        src={src}
        alt={alt}
      />
      {loading && (
        <div
          className={`skeleton flex !h-full !w-full items-center justify-center text-brand-white/10 !rounded-none ${extendStyle}`}
        >
          <p>{alt}</p>
        </div>
      )}
    </button>
  );
};

export default BasicImage;

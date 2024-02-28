import { Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import { getBucketImageSrc } from "~/integrations/_master/storage";

type Props = {
  onClick?: () => void;
  src: string;
  alt: string;
  extendStyle?: string;
  skeletonStyle?: string;
  hoverEffect?: "grow";
  link?: string | null;
};

const BasicImage = ({
  src,
  alt,
  onClick,
  extendStyle,
  hoverEffect,
  link,
  skeletonStyle,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const image = new Image();
    image.src = getBucketImageSrc(src);

    image.onload = () => {
      setLoading(false);
    };

    return () => {
      image.onload = null;
    };
  }, [src]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    onClick && onClick();
  };

  return (
    <>
      {!loading ? (
        <Link
          to={link || ""}
          onClick={(e) => onClick && !link && handleClick(e)}
          className={`relative h-full w-full`}
        >
          <img
            className={`object-cover
              ${extendStyle ? extendStyle : ""}
              ${hoverEffect ? "hover:scale-[1.025]" : ""}
              ${!link ? "select-none" : ""}
              `}
            src={getBucketImageSrc(src)}
            alt={alt}
          />
        </Link>
      ) : (
        <Link
          to={link || ""}
          className={`skeleton flex items-center justify-center text-brand-white/10 !rounded-none h-full w-full ${skeletonStyle}`}
        >
          <p>{alt}</p>
        </Link>
      )}
    </>
  );
};

export default BasicImage;

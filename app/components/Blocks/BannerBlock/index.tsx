import { useNavigate } from "@remix-run/react";

type Props = {
  image: Image;
  alt?: string;
  url?: string;
};

const BannerBlock = ({ image, alt, url }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[100vw] sm:w-[1280px]">
      <img
        src={image?.url}
        alt={alt || "banner_image"}
        onClick={() => url && navigate(url)}
        className={`h-[146px] w-full max-w-[100vw] object-cover max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]  ${
          url && "cursor-pointer"
        }`}
      />
    </div>
  );
};

export default BannerBlock;

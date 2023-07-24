import { useNavigate } from "@remix-run/react";

type Props = {
  image: Image;
  url?: string;
};

const BannerBlock = ({ image, url }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[100vw] sm:w-[1280px]">
      <img
        src={image?.url}
        alt="banner_image"
        onClick={() => url && navigate(url)}
        className={`h-[110px] w-full max-w-[100vw] object-cover md:h-[146px]  ${
          url && "cursor-pointer"
        }`}
      />
    </div>
  );
};

export default BannerBlock;

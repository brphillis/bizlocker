import { useNavigate } from "@remix-run/react";

type Props = {
  image: Image;
  url?: string;
};

const BannerBlock = ({ image, url }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen w-screen sm:w-[1280px]">
      <img
        src={image?.url}
        alt="banner_image"
        onClick={() => url && navigate(url)}
        className={`max-w-screen h-[120px] w-full object-cover sm:h-max ${
          url && "cursor-pointer"
        }`}
      />
    </div>
  );
};

export default BannerBlock;

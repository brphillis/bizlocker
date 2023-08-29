import { useNavigate } from "@remix-run/react";

type Props = {
  content: Campaign | Promotion | ContentImage | Image;
  type: string;
  options: BlockOptions;
};

const BannerBlock = ({ content, type, options }: Props) => {
  const navigate = useNavigate();

  const { bannerImage, name } = content as Promotion | Campaign;
  const { image, href } = content as ContentImage;
  const { size } = options;

  const generateImageLink = () => {
    if (type === "promotion") {
      return `/promotion/${name}`;
    } else if (type === "campaign") {
      return `/campaign/${name}`;
    } else if (type === "image") {
      return href;
    } else return "";
  };

  const imageLink = generateImageLink();

  return (
    <div className="max-w-[100vw] overflow-visible sm:w-max">
      {size === "small" && (
        <img
          onClick={() => imageLink && navigate(imageLink)}
          style={{ cursor: imageLink ? "pointer" : "auto" }}
          src={bannerImage?.url || image?.url}
          alt={name || href}
          className="mx-auto block h-[146px] w-full max-w-full object-cover max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]"
        />
      )}

      {size === "medium" && (
        <img
          onClick={() => imageLink && navigate(imageLink)}
          style={{ cursor: imageLink ? "pointer" : "auto" }}
          src={bannerImage?.url || image?.url}
          alt={name || href}
          className="mx-auto block h-[219px] w-full max-w-full object-cover max-xl:h-[186px] max-lg:h-[125px] max-md:h-[132px]"
        />
      )}

      {size === "large" && (
        <img
          onClick={() => imageLink && navigate(imageLink)}
          style={{ cursor: imageLink ? "pointer" : "auto" }}
          src={bannerImage?.url || image?.url}
          alt={name || href}
          className="h-[292px] w-[1400px] max-w-max object-cover max-xl:h-[248px] max-lg:h-[224px] max-md:h-[196px]"
        />
      )}

      {size === "native" && (
        <img
          onClick={() => imageLink && navigate(imageLink)}
          style={{ cursor: imageLink ? "pointer" : "auto" }}
          src={bannerImage?.url || image?.url}
          alt={name || href}
          className="object-cover shadow-md max-xl:h-[248px] max-lg:h-[224px] max-md:h-[148px]"
        />
      )}
    </div>
  );
};

export default BannerBlock;

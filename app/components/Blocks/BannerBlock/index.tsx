import { useNavigate } from "@remix-run/react";

type Props = {
  content: BlockContent | Campaign | Promotion;
  type?: string;
  options?: BlockOptions[];
};

const BannerBlock = ({ content, type, options: ArrayOptions }: Props) => {
  const navigate = useNavigate();
  const options = ArrayOptions && ArrayOptions[0];
  const promotionImage =
    ((content as BlockContent)?.promotion as Promotion)?.bannerImage?.url ||
    (content as Campaign)?.bannerImage?.url;
  const campaignImage =
    ((content as BlockContent)?.campaign as Campaign)?.bannerImage?.url ||
    (content as Promotion)?.bannerImage?.url;
  const contentImage = ((content as BlockContent)?.image as Image)?.url;
  const bannerImage = contentImage || promotionImage || campaignImage;

  const { name } = content as Promotion | Campaign;
  const { url } = content as Image;
  const { size } = options || {};

  const generateImageLink = () => {
    if (type === "promotion") {
      return `/promotion/${name}`;
    } else if (type === "campaign") {
      return `/campaign/${name}`;
    } else if (type === "image") {
      return url;
    } else return "";
  };

  const imageLink = generateImageLink();
  return (
    <div className="max-w-[100vw] overflow-visible sm:w-max">
      {(size === "small" || !size) && (
        <img
          // onClick={() => imageLink && navigate(imageLink)}
          style={{ cursor: imageLink ? "pointer" : "auto" }}
          src={bannerImage}
          alt={name || url}
          className="mx-auto block h-[146px] w-full max-w-[1280px] overflow-hidden object-cover max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]"
        />
      )}

      {size === "medium" && (
        <img
          onClick={() => imageLink && navigate(imageLink)}
          style={{ cursor: imageLink ? "pointer" : "auto" }}
          src={bannerImage}
          alt={name || url}
          className="mx-auto block h-[219px] w-full max-w-[1280px] object-cover max-xl:h-[186px] max-lg:h-[125px] max-md:h-[132px]"
        />
      )}

      {size === "large" && (
        <img
          onClick={() => imageLink && navigate(imageLink)}
          style={{ cursor: imageLink ? "pointer" : "auto" }}
          src={bannerImage}
          alt={name || url}
          className="h-[292px] w-[1400px] max-w-[1280px] object-cover max-xl:h-[248px] max-lg:h-[224px] max-md:h-[196px]"
        />
      )}

      {size === "native" && (
        <img
          onClick={() => imageLink && navigate(imageLink)}
          style={{ cursor: imageLink ? "pointer" : "auto" }}
          src={bannerImage}
          alt={name || url}
          className="object-cover shadow-md max-xl:h-[248px] max-lg:h-[224px] max-md:h-[148px]"
        />
      )}
    </div>
  );
};

export default BannerBlock;

import { useNavigate } from "@remix-run/react";
import { determineSingleContentType } from "~/helpers/blockContentHelpers";
import { generateColor } from "~/utility/colors";

type Props = {
  content: BlockContent;
  options?: BlockOptions[];
};

const BannerBlock = ({ content, options: ArrayOptions }: Props) => {
  const navigate = useNavigate();
  const options = ArrayOptions && ArrayOptions[0];
  const {
    backgroundColor,
    borderColor,
    borderDisplay,
    borderRadius,
    borderSize,
    margin,
    size,
    linkOne,
  } = options || {};

  const contentType = determineSingleContentType(content as BlockContent);

  let name: string = "bannerImage";
  let link: string = "";
  let imageSrc: string = "";

  if (contentType === "promotion") {
    const promotion = content?.promotion as Promotion;
    name = promotion?.name || name;
    link = `/promotion/${name}`;
    imageSrc = promotion?.bannerImage?.url || imageSrc;
  } else if (contentType === "campaign") {
    const campaign = content?.campaign as Campaign;
    name = campaign?.name || name;
    link = `/campaign/${name}`;
    imageSrc = campaign?.bannerImage?.url || imageSrc;
  } else if (contentType === "image") {
    if (linkOne) {
      link = linkOne;
    }
    imageSrc = ((content as BlockContent)?.image as Image)?.url || imageSrc;
    name =
      ((content as BlockContent)?.image as Image)?.altText || "bannerImage";
  }

  const imageStyle = {
    cursor: link ? "pointer" : "auto",
    borderRadius: borderRadius || "unset",
    border:
      borderSize && borderColor
        ? `${borderSize} solid ${generateColor(borderColor)}`
        : "unset",
  };

  return (
    <div
      style={{
        backgroundColor: generateColor(backgroundColor),
        borderRadius: borderRadius || "unset",
      }}
      className={`max-w-[100vw] overflow-visible sm:w-max ${margin} ${borderDisplay}`}
    >
      {["small", undefined].includes(size) && (
        <img
          onClick={() => link && navigate(link)}
          src={imageSrc}
          alt={name}
          className="mx-auto block h-[146px] w-full max-w-[1280px] overflow-hidden object-cover max-xl:h-[124px] max-lg:h-[100px] max-md:h-[88px]"
          style={imageStyle}
        />
      )}

      {size === "medium" && (
        <img
          onClick={() => link && navigate(link)}
          src={imageSrc}
          alt={name}
          className="mx-auto block h-[219px] w-full max-w-[1280px] object-cover max-xl:h-[186px] max-lg:h-[125px] max-md:h-[132px]"
          style={imageStyle}
        />
      )}

      {size === "large" && (
        <img
          onClick={() => link && navigate(link)}
          src={imageSrc}
          alt={name}
          className="h-[292px] w-[1400px] max-w-[1280px] object-cover max-xl:h-[248px] max-lg:h-[224px] max-md:h-[196px]"
          style={imageStyle}
        />
      )}

      {size === "native" && (
        <img
          onClick={() => link && navigate(link)}
          src={imageSrc}
          alt={name}
          className="object-cover shadow-md max-xl:h-[248px] max-lg:h-[224px] max-md:h-[148px]"
          style={imageStyle}
        />
      )}
    </div>
  );
};

export default BannerBlock;

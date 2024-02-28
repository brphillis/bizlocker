import { BlockOptions } from "@prisma/client";
import { Link } from "@remix-run/react";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";
import TextContainer from "../../_ItemComponents/TextContainer";
import { getBucketImageSrc } from "~/integrations/_master/storage";

type Props = {
  blockOptions: BlockOptions;
  imageSrc: string;
  index: number;
  imageLink: string;
  imageName: string;
};

const ContentTile = ({
  blockOptions,
  imageSrc,
  index,
  imageLink,
  imageName,
}: Props) => {
  const {
    itemBackgroundColorsPrimary,
    itemBorderRadius,
    itemFilters,
    itemLinks,
  } = blockOptions;

  return (
    <Link
      className={`relative overflow-hidden h-full w-full ${itemBorderRadius[index]} `}
      to={itemLinks[index] ? itemLinks[index] : imageLink && imageLink}
    >
      <PatternBackground
        backgroundColor={getThemeColorValueByName(
          itemBackgroundColorsPrimary[index],
        )}
      />

      <div className="h-full w-full">
        <img
          className={`relative object-fit h-full w-full ${itemFilters[index]}`}
          src={getBucketImageSrc(imageSrc)}
          alt={imageName}
        />
      </div>

      <TextContainer blockOptions={blockOptions} index={index} />
    </Link>
  );
};

export default ContentTile;

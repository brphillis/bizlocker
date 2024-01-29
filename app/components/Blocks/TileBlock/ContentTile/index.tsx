import { BlockOptions } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";
import TextContainer from "./TextContainer";

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
  const navigate = useNavigate();

  const {
    itemBackgroundColorsPrimary,
    itemBorderRadius,
    itemFilters,
    itemLinks,
  } = blockOptions;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`relative overflow-hidden h-full w-full ${itemBorderRadius[index]} `}
      onClick={() =>
        itemLinks[index]
          ? navigate(itemLinks[index])
          : imageLink && navigate(imageLink)
      }
      onKeyDown={() =>
        itemLinks[index]
          ? navigate(itemLinks[index])
          : imageLink && navigate(imageLink)
      }
    >
      <PatternBackground
        backgroundColor={getThemeColorValueByName(
          itemBackgroundColorsPrimary[index],
        )}
      />

      <div className="h-full w-full">
        <img
          className={`relative object-fit h-full w-full ${itemFilters[index]}`}
          src={imageSrc}
          alt={imageName}
        />
      </div>

      <TextContainer blockOptions={blockOptions} index={index} />
    </div>
  );
};

export default ContentTile;

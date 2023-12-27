import { useNavigate } from "@remix-run/react";
import PatternBackground from "~/components/Layout/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  borderRadius: string | null | undefined;
  contentType: string | undefined;
  filter: string;
  imageSrc: string;
  itemBackgroundColor: string;
  joinedContent: any;
  link: string;
  name: string;
};

const ContentTile = ({
  filter,
  imageSrc,
  itemBackgroundColor,
  borderRadius,
  link,
  name,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className={`h-full w-full ${borderRadius} ${
        borderRadius ? "p-6 max-md:p-3" : "p-0"
      }`}
    >
      <PatternBackground
        backgroundColor={getThemeColorValueByName(itemBackgroundColor)}
      />
      <img
        className={`object-fit h-full w-full ${filter}`}
        onClick={() => link && navigate(link)}
        src={imageSrc}
        alt={name}
      />
    </div>
  );
};

export default ContentTile;

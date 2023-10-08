import { useNavigate } from "@remix-run/react";
import { generateColor } from "~/utility/colors";

type Props = {
  index: number;
  joinedContent: any;
  itemSecondaryColors: (string | null | undefined)[];
  filters: (string | null | undefined)[];
  borderRadius: string | null | undefined;
  name: string;
  imageSrc: string;
  link: string;
};

const ContentTile = ({
  index,
  joinedContent,
  itemSecondaryColors,
  filters,
  borderRadius,
  name,
  imageSrc,
  link,
}: Props) => {
  const navigate = useNavigate();
  return (
    <img
      style={{
        backgroundColor: itemSecondaryColors[index]
          ? generateColor(itemSecondaryColors[index]!)
          : "unset",
      }}
      className={`object-fit h-full w-full 
     ${filters[index]} 
     ${borderRadius ? "p-3" : " "}
     ${borderRadius === "100%" ? "max-md:!p-2" : " "}
     ${joinedContent.length % 2 !== 0 ? "max-sm:last:col-span-full" : ""}
     `}
      onClick={() => link && navigate(link)}
      src={imageSrc}
      alt={name}
    />
  );
};

export default ContentTile;

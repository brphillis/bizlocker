import { useNavigate } from "@remix-run/react";
import { generateColor } from "~/utility/colors";

type Props = {
  borderRadius: string | null | undefined;
  contentType: string | undefined;
  filter: string;
  imageSrc: string;
  itemSecondaryColor: string;
  joinedContent: any;
  link: string;
  name: string;
};

const ContentTile = ({
  borderRadius,
  contentType,
  filter,
  imageSrc,
  itemSecondaryColor,
  joinedContent,
  link,
  name,
}: Props) => {
  const navigate = useNavigate();

  return (
    <img
      style={{
        backgroundColor: itemSecondaryColor
          ? generateColor(itemSecondaryColor)
          : "unset",
        borderRadius: borderRadius || " ",
        padding:
          contentType === "brand" && borderRadius === "100%" ? "12px" : "",
      }}
      className={`object-fit h-full w-full 
     ${filter} 
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

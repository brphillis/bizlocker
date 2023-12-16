import { useNavigate } from "@remix-run/react";
import Icon from "~/components/Icon";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  index: number;
  joinedContent: any;
  itemColor?: string;
  itemTitleColor?: string;
  itemBackgroundColor?: string;
  borderRadius: string | null | undefined;
  filter?: string;
  title?: string;
  name: string;
  imageSrc: string;
  link?: string;
};

const IconTile = ({
  index,
  itemColor,
  itemTitleColor,
  itemBackgroundColor,
  title,
  filter,
  borderRadius,
  joinedContent,
  link,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center
      ${filter} 
      ${itemBackgroundColor}
      ${borderRadius ? "p-3" : " "}
      ${
        borderRadius === "rounded-full" || borderRadius?.includes("mask")
          ? "max-md:!p-2"
          : " "
      }`}
      onClick={() => (link ? navigate(link) : null)}
    >
      <Icon
        iconName={joinedContent[index].icon as any}
        size={1000}
        styles="h-[80%] w-[80%] p-[20%] -mb-2 -mt-[20%] max-md:-mt-3"
        color={itemColor ? getThemeColorValueByName(itemColor) : undefined}
      />
      {title && title !== "undefined" && (
        <p
          className={`-mt-[15%] font-bold max-md:-mt-1 max-md:!text-xs ${itemTitleColor}`}
          style={{
            fontSize: "150%",
          }}
        >
          {title}
        </p>
      )}
    </div>
  );
};

export default IconTile;

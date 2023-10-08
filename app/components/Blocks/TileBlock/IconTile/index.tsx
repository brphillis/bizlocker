import { useNavigate } from "@remix-run/react";
import React from "react";
import Icon from "~/components/Icon";
import { generateColor } from "~/utility/colors";

type Props = {
  index: number;
  joinedContent: any;
  itemColors: (string | null | undefined)[];
  borderRadius: string | null | undefined;
  filters: (string | null | undefined)[];
  itemTitles: (string | null | undefined)[];
  name: string;
  imageSrc: string;
  links: (string | null | undefined)[];
};

const IconTile = ({
  index,
  itemColors,
  itemTitles,
  filters,
  borderRadius,
  joinedContent,
  links,
}: Props) => {
  const navigate = useNavigate();
  return (
    <div
      className={`h-fit w-fit
  ${filters[index]} 
  ${borderRadius ? "p-3" : " "}
  ${borderRadius === "100%" ? "max-md:!p-2" : " "}
  ${joinedContent.length % 2 !== 0 ? "max-sm:last:col-span-full" : ""}
  flex flex-col items-center justify-center`}
      onClick={() => links && navigate(links[index] || "")}
    >
      <Icon
        iconName={joinedContent[index].icon as any}
        size={1000}
        styles="h-[80%] w-[80%] p-[20%] -mb-2 -mt-[20%] max-md:-mt-3"
        color={generateColor(itemColors[index] || "BLACK")}
      />
      <p
        className="-mt-[15%] font-bold max-md:-mt-1 max-md:!text-xs"
        style={{
          color: generateColor(itemColors[index] || "BLACK"),
          fontSize: "150%",
        }}
      >
        {itemTitles[index]}
      </p>
    </div>
  );
};

export default IconTile;

import { useNavigate } from "@remix-run/react";
import React from "react";
import Icon from "~/components/Icon";
import { generateColor } from "~/utility/colors";

type Props = {
  index: number;
  joinedContent: any;
  itemColor: string;
  borderRadius: string | null | undefined;
  filter: string;
  title: string;
  name: string;
  imageSrc: string;
  link: string;
};

const IconTile = ({
  index,
  itemColor,
  title,
  filter,
  borderRadius,
  joinedContent,
  link,
}: Props) => {
  const navigate = useNavigate();
  return (
    <div
      className={`h-fit w-fit
  ${filter} 
  ${borderRadius ? "p-3" : " "}
  ${borderRadius === "100%" ? "max-md:!p-2" : " "}

  flex flex-col items-center justify-center`}
      onClick={() => link && navigate(link || "")}
    >
      <Icon
        iconName={joinedContent[index].icon as any}
        size={1000}
        styles="h-[80%] w-[80%] p-[20%] -mb-2 -mt-[20%] max-md:-mt-3"
        color={generateColor(itemColor || "BLACK")}
      />
      <p
        className="-mt-[15%] font-bold max-md:-mt-1 max-md:!text-xs"
        style={{
          color: generateColor(itemColor || "BLACK"),
          fontSize: "150%",
        }}
      >
        {title}
      </p>
    </div>
  );
};

export default IconTile;

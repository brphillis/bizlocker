import { useNavigate } from "@remix-run/react";

type Props = {
  content: Campaign[] | Promotion[];
  options: BlockOptions;
};

const TileBlock = ({ content, options }: Props) => {
  const navigate = useNavigate();
  const { columns } = options || {};

  return (
    <div
      className="grid place-items-center gap-3 gap-y-3 px-3 max-sm:!grid-cols-2 sm:gap-6 lg:px-0"
      style={{
        gridTemplateColumns: columns
          ? `repeat(${columns}, minmax(0, 1fr))`
          : "repeat(2, minmax(0, 1fr))",
      }}
    >
      {content?.map(({ tileImage, name }: Promotion | Campaign) => {
        return (
          <img
            key={"tileImage_" + name}
            // style={{ height: "100%", width: "100%" }}
            className={`h-full w-full cursor-pointer object-cover transition duration-300 ease-in-out hover:scale-[1.01] ${
              content.length % 2 !== 0 ? "max-sm:last:col-span-full" : ""
            } `}
            onClick={() => navigate(`/promotion/${name}`)}
            src={tileImage.url}
            alt={name.toLowerCase() + " tile image"}
          />
        );
      })}
    </div>
  );
};

export default TileBlock;

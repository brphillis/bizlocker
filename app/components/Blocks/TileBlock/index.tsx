import { useNavigate } from "@remix-run/react";

type Props = {
  content: Campaign[] | Promotion[];
  options: BlockOptions;
};

const TileBlock = ({ content, options }: Props) => {
  const navigate = useNavigate();
  const { columns } = options || {};
  console.log("CONT", content);
  return (
    <div
      className="max-w-screen grid place-items-center gap-3 gap-y-3 px-3 max-sm:!grid-cols-2 sm:gap-6 md:px-0"
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
            className="h-full w-full cursor-pointer object-cover transition duration-300 ease-in-out hover:scale-[1.01]"
            onClick={() => navigate(`/promotion/${name}`)}
            src={tileImage.url}
            alt={"tileImage_" + name}
          />
        );
      })}
    </div>
  );
};

export default TileBlock;

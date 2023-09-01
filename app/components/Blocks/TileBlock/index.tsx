import { useNavigate } from "@remix-run/react";

type Props = {
  content: Campaign[] | Promotion[];
  type: string;
  options: BlockOptions;
};

const TileBlock = ({ content, type, options }: Props) => {
  const navigate = useNavigate();
  const { columns } = options || {};
  return (
    <div
      className="relative grid h-max place-items-center gap-3 px-3 max-sm:!grid-cols-2 sm:gap-6 lg:px-0"
      style={{
        gridTemplateColumns: columns
          ? `repeat(${columns}, minmax(0, 1fr))`
          : "repeat(2, minmax(0, 1fr))",
      }}
    >
      {content?.map(
        (contentData: Promotion | Campaign | ContentImage, i: number) => {
          const { tileImage, name } = contentData as Promotion | Campaign;
          const { image, href } = contentData as ContentImage;

          const generateImageLink = () => {
            if (type === "promotion") {
              return `/promotion/${name}`;
            } else if (type === "campaign") {
              return `/campaign/${name}`;
            } else if (type === "image") {
              return href;
            } else return "";
          };

          const imageLink = generateImageLink();

          return (
            <img
              key={"tileImage_" + (name || i)}
              className={
                "relative h-full w-full cursor-pointer object-cover transition duration-300 ease-in-out hover:scale-[1.01] " +
                (content.length % 2 !== 0 ? "max-sm:last:col-span-full" : "")
              }
              onClick={() => navigate(imageLink)}
              src={tileImage?.url || image?.url}
              alt={name || href}
            />
          );
        }
      )}
    </div>
  );
};

export default TileBlock;

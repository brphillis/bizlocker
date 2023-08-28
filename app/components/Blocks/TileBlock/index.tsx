import { useNavigate } from "@remix-run/react";

type Props = {
  content: Campaign[] | Promotion[];
  options: BlockOptions;
};

const determineType = (
  discountPercentage: number,
  minSaleRange: number,
  image: Image
) => {
  if (image) {
    return "image";
  } else if (discountPercentage) {
    return "promotion";
  } else if (minSaleRange) {
    return "campaign";
  }
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
      {content?.map((contentData: any) => {
        const { tileImage, name } = contentData as Promotion | Campaign;
        const { discountPercentage } = contentData as Promotion;
        const { minSaleRange } = contentData as Campaign;
        const { image, href } = contentData as ContentImage;

        const generateImageLink = (type: string) => {
          if (type === "promotion") {
            return `/promotion/${name}`;
          } else if (type === "campaign") {
            return `/campaign/${name}`;
          } else if (type === "image") {
            return href;
          } else return "";
        };

        const type = determineType(discountPercentage, minSaleRange, image);
        let imageLink: string;
        if (type) {
          imageLink = generateImageLink(type);
        }

        return (
          <img
            key={"tileImage_" + name}
            className={`h-full w-full cursor-pointer object-cover transition duration-300 ease-in-out hover:scale-[1.01] ${
              content.length % 2 !== 0 ? "max-sm:last:col-span-full" : ""
            } `}
            onClick={() => navigate(imageLink)}
            src={tileImage?.url || image?.url}
            alt={name || href}
          />
        );
      })}
    </div>
  );
};

export default TileBlock;

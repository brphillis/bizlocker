import { useNavigate } from "@remix-run/react";
import { determineSingleContentType } from "~/helpers/blockContentHelpers";

type Props = {
  content: ContentData;
  options: BlockOptions[];
};

const TileBlock = ({ content, options: ArrayOptions }: Props) => {
  const navigate = useNavigate();
  const joinedContent: any = [];
  const options = ArrayOptions[0];
  const columns = options?.columns || 2;
  const { linkOne, linkTwo, linkThree, linkFour, linkFive, linkSix } =
    options || {};

  const links = [linkOne, linkTwo, linkThree, linkFour, linkFive, linkSix];

  if ((content?.image as Image[])?.length > 0) {
    (content?.image as Image[])?.forEach((e: any) =>
      joinedContent.push({ image: e })
    );
  }
  if ((content?.promotion as Promotion[])?.length > 0) {
    (content?.promotion as Promotion[]).forEach((e: any) =>
      joinedContent.push({ promotion: e })
    );
  }
  if ((content?.campaign as Campaign[])?.length > 0) {
    (content?.campaign as Campaign[])?.forEach((e: any) =>
      joinedContent.push({ campaign: e })
    );
  }

  return (
    <div
      className="relative grid h-max place-items-center gap-3 px-3 max-sm:!grid-cols-2 sm:gap-6 lg:px-0"
      style={{
        gridTemplateColumns: columns
          ? `repeat(${columns}, minmax(0, 1fr))`
          : "repeat(2, minmax(0, 1fr))",
      }}
    >
      {joinedContent?.map((contentData: any, i: number) => {
        const contentType = determineSingleContentType(
          contentData as BlockContent
        );

        let name: string = "tileImage";
        let link: string = "";
        let imageSrc: string = "";
        if (contentType === "promotion") {
          const promotion = contentData?.promotion as Promotion;
          name = promotion?.name || name;
          link = `/promotion/${name}`;
          imageSrc = promotion?.tileImage?.url || imageSrc;
        } else if (contentType === "campaign") {
          const campaign = contentData?.campaign as Campaign;
          name = campaign?.name || name;
          link = `/campaign/${name}`;
          imageSrc = campaign?.tileImage?.url || imageSrc;
        } else if (contentType === "image") {
          if (links[i]) {
            link = links[i]!;
          }
          imageSrc =
            ((contentData as BlockContent)?.image as Image)?.url || imageSrc;
          name = ((contentData as BlockContent)?.image as Image)?.altText || "";
        }

        return (
          <img
            key={"tileImage_" + (name || i)}
            className={
              "relative h-auto w-auto cursor-pointer object-cover transition duration-300 ease-in-out hover:scale-[1.01] " +
              (joinedContent.length % 2 !== 0
                ? "max-sm:last:col-span-full"
                : "")
            }
            onClick={() => link && navigate(link)}
            src={imageSrc}
            alt={name}
          />
        );
      })}
    </div>
  );
};

export default TileBlock;

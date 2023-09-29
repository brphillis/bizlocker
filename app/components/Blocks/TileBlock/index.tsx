// import { useNavigate } from "@remix-run/react";

type Props = {
  content: ContentData;
  options: BlockOptions[];
};

const TileBlock = ({ content, options: ArrayOptions }: Props) => {
  const joinedContent: any = [];
  const options = ArrayOptions[0];
  const columns = options?.columns || 2;

  if ((content?.image as Image[])?.length > 0) {
    (content?.image as Image[])?.forEach((e: any) => joinedContent.push(e));
  }
  if ((content?.promotion as Promotion[])?.length > 0) {
    (content?.promotion as Promotion[]).forEach((e: any) =>
      joinedContent.push(e)
    );
  }
  if ((content?.campaign as Campaign[])?.length > 0) {
    (content?.campaign as Campaign[])?.forEach((e: any) =>
      joinedContent.push(e)
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
        const { name } = contentData as any;
        const { url, altText } = contentData as Image;

        const promotionOrCampaignImage = contentData?.tileImage?.url;
        const contentImage = contentData?.image?.url;
        const tileImage = contentImage || promotionOrCampaignImage;

        // const generateImageLink = () => {
        //   if (type === "promotion") {
        //     return `/promotion/${name}`;
        //   } else if (type === "campaign") {
        //     return `/campaign/${name}`;
        //   } else if (type === "image") {
        //     return href;
        //   } else return "";
        // };

        // const imageLink = generateImageLink();

        return (
          <img
            key={"tileImage_" + (name || i)}
            className={
              "relative h-auto w-auto cursor-pointer object-cover transition duration-300 ease-in-out hover:scale-[1.01] " +
              (joinedContent.length % 2 !== 0
                ? "max-sm:last:col-span-full"
                : "")
            }
            // onClick={() => navigate(imageLink)}
            src={tileImage || url}
            alt={name || altText}
          />
        );
      })}
    </div>
  );
};

export default TileBlock;

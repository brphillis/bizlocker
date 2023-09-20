// import { useNavigate } from "@remix-run/react";

type Props = {
  content: any;
  options: BlockOptions[];
};

const TileBlock = ({ content: ArrayContent, options: ArrayOptions }: Props) => {
  let content: any = [];
  const options = ArrayOptions[0];
  const columns = options?.columns || 2;

  if (ArrayContent[0].image.length > 0) {
    ArrayContent[0].image.forEach((e: any) => content.push(e));
  }
  if (ArrayContent[0].promotion.length > 0) {
    ArrayContent[0].promotion.forEach((e: any) => content.push(e));
  }
  if (ArrayContent[0].campaign.length > 0) {
    ArrayContent[0].campaign.forEach((e: any) => content.push(e));
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
      {content?.map((contentData: any, i: number) => {
        const { name } = contentData as any;
        const { url, altText } = contentData as Image;
        console.log("TILEDATA", contentData);

        const promotionOrCampaignImage = contentData?.tileImage?.url;
        const contentImage = contentData?.image?.url;
        const tileImage = contentImage || promotionOrCampaignImage;
        // console.log("HERE", contentData);
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
              (content.length % 2 !== 0 ? "max-sm:last:col-span-full" : "")
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

import BasicImage from "~/components/Client/BasicImage";
import { PromotionWithContent } from "~/models/Promotions/types";

type Props = {
  promotion: PromotionWithContent;
};

const PromotionTile = ({ promotion }: Props) => {
  return (
    <BasicImage
      alt="activeImage"
      extendStyle="!w-52 !h-52 hover:scale-[1.01] duration-300 cursor-pointer shadow-[0_18px_10px_-15px_rgba(0,0,0,0.5)] border-brand-white/10 border"
      src={promotion!.tileImage!.href!}
      link={`/promotion/${promotion.name}`}
    />
  );
};

export default PromotionTile;

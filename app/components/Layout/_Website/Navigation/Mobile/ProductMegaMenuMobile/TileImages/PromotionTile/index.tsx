import BasicImage from "~/components/Client/BasicImage";
import { PromotionWithContent } from "~/models/Promotions/types";

type Props = {
  promotion: PromotionWithContent;
};

const PromotionTile = ({ promotion }: Props) => {
  return (
    <label
      htmlFor="mobile-navigation-state"
      className="w-full h-full relative flex items-center cursor-pointer border-brand-white/10 border shadow-[0_18px_10px_-15px_rgba(0,0,0,0.5)] hover:scale-[1.01] duration-300"
    >
      <BasicImage
        alt="activeImage"
        src={promotion!.tileImage!.href!}
        link={`/promotion/${promotion.name}`}
      />
    </label>
  );
};

export default PromotionTile;

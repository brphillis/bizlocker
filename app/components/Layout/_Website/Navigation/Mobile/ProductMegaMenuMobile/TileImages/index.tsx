import { PromotionWithContent } from "~/models/Promotions/types";
import PromotionTile from "./PromotionTile";

type Props = {
  randomPromotions: PromotionWithContent[];
};

const TileImages = ({ randomPromotions }: Props) => {
  return (
    <div className="relative flex items-center gap-3 py-3">
      {randomPromotions?.[0] && (
        <PromotionTile promotion={randomPromotions[0]} />
      )}

      {randomPromotions?.[1] && (
        <PromotionTile promotion={randomPromotions[1]} />
      )}
    </div>
  );
};

export default TileImages;

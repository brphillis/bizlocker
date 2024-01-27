import { useNavigate } from "@remix-run/react";
import BasicImage from "~/components/Client/BasicImage";
import { PromotionWithContent } from "~/models/Promotions/types";

type Props = {
  promotion: PromotionWithContent;
};

const PromotionTile = ({ promotion }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      role="button"
      tabIndex={0}
      className="w-52 h-52 hover:scale-[1.01] duration-300 cursor-pointer"
      onClick={() => {
        navigate({
          pathname: `/promotion/${promotion.name}`,
        });
      }}
      onKeyDown={() => {
        navigate({
          pathname: `/promotion/${promotion.name}`,
        });
      }}
    >
      <BasicImage alt="activeImage" src={promotion!.tileImage!.href!} />
    </div>
  );
};

export default PromotionTile;

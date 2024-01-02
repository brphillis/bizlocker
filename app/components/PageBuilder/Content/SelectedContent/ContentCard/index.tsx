import type { BlockContentType } from "~/utility/blockMaster/types";
import SquareIconButton from "~/components/Buttons/SquareIconButton";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  type: BlockContentType;
  name: string;
  onNavigate: () => void;
  onDelete: () => void;
};

const ContentCard = ({ type, name, onDelete, onNavigate }: Props) => {
  return (
    <div className="flex cursor-pointer items-center justify-between rounded-sm bg-brand-white/20 p-3 hover:scale-[1.005]">
      <div>
        {type && capitalizeFirst(type)}
        {" / "}
        {name && capitalizeFirst(name)}
      </div>
      <div className="flex items-center gap-3">
        <SquareIconButton
          iconName="IoSearch"
          size="small"
          color="primary"
          onClick={() => onNavigate()}
        />

        <SquareIconButton
          iconName="IoTrashBin"
          size="small"
          color="error"
          onClick={() => onDelete()}
        />
      </div>
    </div>
  );
};

export default ContentCard;

import type { BlockContentType } from "~/utility/blockMaster/types";
import SquareIconButton from "~/components/Buttons/SquareIconButton";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  type: BlockContentType;
  name: string;
  onNavigate: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
};

const ContentCard = ({ type, name, onAdd, onDelete, onNavigate }: Props) => {
  return (
    <div className="flex cursor-pointer items-center justify-between rounded-sm bg-brand-white/20 p-3 hover:scale-[1.005]">
      <div className="text-brand-white">
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

        {onDelete && (
          <SquareIconButton
            iconName="IoTrashBin"
            size="small"
            color="error"
            onClick={() => onDelete()}
          />
        )}

        {onAdd && (
          <SquareIconButton
            iconName="IoAdd"
            size="small"
            color="primary"
            onClick={() => onAdd()}
          />
        )}
      </div>
    </div>
  );
};

export default ContentCard;

import BlockIcon from "~/components/PageBuilder/BlockSelect/BlockIcon";
import SquareIconButton from "~/components/Buttons/SquareIconButton";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  index: number;
  blockCount: number;
  onClick: (index: number) => void;
  onChangeOrder: (dir: "up" | "down") => void;
  onDelete: () => void;
  name: string;
};

const BlockCard = ({
  index,
  onClick,
  onChangeOrder,
  onDelete,
  name,
  blockCount,
}: Props) => {
  return (
    <div className="flex w-full cursor-pointer items-center justify-between rounded-sm border border-brand-white/25 bg-brand-white/20 p-3 hover:scale-[1.005]">
      <div
        className="flex items-center gap-3"
        onClick={() => {
          onClick(index);
        }}
      >
        {/* NUMBER */}
        <div className="text-xs"># {index + 1}</div>
        {/* ICON */}
        <div className="flex gap-3">
          <BlockIcon blockName={name} size={18} styles={"mt-[3px]"} />
          <p className="font-bold">{capitalizeFirst(name)}</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex h-full flex-row items-center justify-start gap-3">
        {index < blockCount - 1 && (
          <SquareIconButton
            iconName="IoArrowDown"
            size="small"
            color="primary"
            onClick={() => onChangeOrder("down")}
          />
        )}

        {index > 0 && (
          <SquareIconButton
            iconName="IoArrowUp"
            size="small"
            color="primary"
            onClick={() => onChangeOrder("up")}
          />
        )}

        <SquareIconButton
          iconName="IoPencilSharp"
          size="small"
          color="primary"
          onClick={() => onClick(index)}
        />

        {index > 0 && (
          <SquareIconButton
            iconName="IoTrashBin"
            size="small"
            color="error"
            onClick={() => onDelete()}
          />
        )}
      </div>
    </div>
  );
};

export default BlockCard;

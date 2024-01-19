import SquareIconButton from "~/components/Buttons/SquareIconButton";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import BlockIcon from "../BlockSelect/BlockIcon";

type Props = {
  index: number;
  blockCount: number;
  onClick: (index: number) => void;
  onChangeOrder: (dir: "up" | "down") => void;
  onDelete: () => void;
  name: string;
  label?: string;
};

const BlockCard = ({
  index,
  onClick,
  onChangeOrder,
  onDelete,
  name,
  blockCount,
  label,
}: Props) => {
  return (
    <div
      className={`flex w-full cursor-pointer items-center justify-between border-b border-b-brand-white/25 
    bg-brand-white/20 p-3 hover:scale-[1.005] ${
      index === 0 && "border-t border-t-brand-white/25"
    }`}
    >
      <div
        className="flex items-center gap-3 text-brand-white"
        onClick={() => {
          onClick(index);
        }}
      >
        {/* NUMBER */}
        <div className="text-xs"># {index + 1}</div>
        {/* ICON */}
        <div className="flex gap-3">
          <BlockIcon blockName={name} size={18} extendStyle={"mt-[1px]"} />
          <p className="font-bold text-sm">{capitalizeFirst(label || name)}</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex h-full flex-row items-center justify-start gap-3">
        {index < blockCount - 1 && (
          <SquareIconButton
            iconName="IoArrowDown"
            size="xsmall"
            color="primary"
            onClick={() => onChangeOrder("down")}
          />
        )}

        {index > 0 && (
          <SquareIconButton
            iconName="IoArrowUp"
            size="xsmall"
            color="primary"
            onClick={() => onChangeOrder("up")}
          />
        )}

        <SquareIconButton
          iconName="IoPencilSharp"
          size="xsmall"
          color="primary"
          onClick={() => onClick(index)}
        />

        {index > 0 && (
          <SquareIconButton
            iconName="IoTrashBin"
            size="xsmall"
            color="error"
            onClick={() => onDelete()}
          />
        )}
      </div>
    </div>
  );
};

export default BlockCard;

import type { BlockOptions } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import BasicButton from "~/components/Buttons/BasicButton";
import OutlineButton from "~/components/Buttons/OutlineButton";

type Props = {
  index: number;
  blockOptions: BlockOptions;
};

const ButtonContainer = ({ index, blockOptions }: Props) => {
  const navigate = useNavigate();
  const {
    itemPrimaryButtons,
    itemPrimaryButtonBorderColors,
    itemPrimaryButtonColors,
    itemPrimaryButtonLabelColors,
    itemPrimaryButtonLabels,
    itemPrimaryButtonLinks,
    itemSecondaryButtonBorderColors,
    itemSecondaryButtonColors,
    itemSecondaryButtonLabelColors,
    itemSecondaryButtonLabels,
    itemSecondaryButtonLinks,
    itemSecondaryButtons,
  } = blockOptions;

  const hasButtons =
    itemPrimaryButtons?.[index] || itemSecondaryButtons?.[index];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        hasButtons ? "flex" : "hidden"
      }`}
    >
      {itemPrimaryButtons?.[index] && (
        <>
          {itemPrimaryButtons?.[index] === "basic" && (
            <BasicButton
              label={itemPrimaryButtonLabels[index]}
              hoverEffect="color"
              clickFunction={() => navigate(itemPrimaryButtonLinks[index])}
              extendStyle={`w-[240px] min-w-max
                ${itemPrimaryButtonBorderColors[index]}
                ${itemPrimaryButtonLabelColors[index]}
                ${itemPrimaryButtonColors[index]}`}
            />
          )}

          {itemPrimaryButtons?.[index] === "outline" && (
            <OutlineButton
              label={itemPrimaryButtonLabels[index]}
              hoverEffect="grow"
              clickFunction={() => navigate(itemPrimaryButtonLinks[index])}
              extendStyle={`w-[240px] min-w-max
                ${itemPrimaryButtonBorderColors[index]}
                ${itemPrimaryButtonLabelColors[index]}`}
            />
          )}
        </>
      )}

      {itemSecondaryButtons?.[index] && (
        <>
          {itemSecondaryButtons?.[index] === "basic" && (
            <BasicButton
              label={itemSecondaryButtonLabels[index]}
              hoverEffect="color"
              clickFunction={() => navigate(itemSecondaryButtonLinks[index])}
              extendStyle={`w-[240px] min-w-max
                ${itemSecondaryButtonBorderColors[index]}
                ${itemSecondaryButtonLabelColors[index]}
                ${itemSecondaryButtonColors[index]}`}
            />
          )}

          {itemSecondaryButtons?.[index] === "outline" && (
            <OutlineButton
              label={itemSecondaryButtonLabels[index]}
              hoverEffect="grow"
              clickFunction={() => navigate(itemSecondaryButtonLinks[index])}
              extendStyle={`w-[240px] min-w-max
                ${itemSecondaryButtonBorderColors[index]}
                ${itemSecondaryButtonLabelColors[index]}`}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ButtonContainer;

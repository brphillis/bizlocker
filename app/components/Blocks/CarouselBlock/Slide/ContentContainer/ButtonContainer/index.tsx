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
    itemButtonsPrimary,
    itemButtonBorderColorsPrimary,
    itemButtonColorsPrimary,
    itemButtonLabelColorsPrimary,
    itemButtonLabelsPrimary,
    itemButtonLinksPrimary,
    itemButtonBorderColorsSecondary,
    itemButtonColorsSecondary,
    itemButtonLabelColorsSecondary,
    itemButtonLabelsSecondary,
    itemButtonLinksSecondary,
    itemButtonsSecondary,
    itemButtonAlign,
  } = blockOptions;

  const hasButtons =
    itemButtonsPrimary?.[index] || itemButtonsSecondary?.[index];

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 
      ${itemButtonAlign[index]}
      ${hasButtons ? "flex" : "hidden"}`}
    >
      {itemButtonsPrimary?.[index] && (
        <>
          {itemButtonsPrimary?.[index] === "basic" && (
            <BasicButton
              label={itemButtonLabelsPrimary[index]}
              hoverEffect="color"
              clickFunction={() => navigate(itemButtonLinksPrimary[index])}
              extendStyle={`w-[240px] min-w-max
                ${itemButtonBorderColorsPrimary[index]}
                ${itemButtonLabelColorsPrimary[index]}
                ${itemButtonColorsPrimary[index]}`}
            />
          )}

          {itemButtonsPrimary?.[index] === "outline" && (
            <OutlineButton
              label={itemButtonLabelsPrimary[index]}
              hoverEffect="grow"
              clickFunction={() => navigate(itemButtonLinksPrimary[index])}
              extendStyle={`w-[240px] min-w-max
                ${itemButtonBorderColorsPrimary[index]}
                ${itemButtonLabelColorsPrimary[index]}`}
            />
          )}
        </>
      )}

      {itemButtonsSecondary?.[index] && (
        <>
          {itemButtonsSecondary?.[index] === "basic" && (
            <BasicButton
              label={itemButtonLabelsSecondary[index]}
              hoverEffect="color"
              clickFunction={() => navigate(itemButtonLinksSecondary[index])}
              extendStyle={`w-[240px] min-w-max
                ${itemButtonBorderColorsSecondary[index]}
                ${itemButtonLabelColorsSecondary[index]}
                ${itemButtonColorsSecondary[index]}`}
            />
          )}

          {itemButtonsSecondary?.[index] === "outline" && (
            <OutlineButton
              label={itemButtonLabelsSecondary[index]}
              hoverEffect="grow"
              clickFunction={() => navigate(itemButtonLinksSecondary[index])}
              extendStyle={`w-[240px] min-w-max
                ${itemButtonBorderColorsSecondary[index]}
                ${itemButtonLabelColorsSecondary[index]}`}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ButtonContainer;

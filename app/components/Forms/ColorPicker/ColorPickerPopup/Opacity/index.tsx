import type { Dispatch, SetStateAction } from "react";
import SquareIconButton from "../../../../../components/Buttons/SquareIconButton";
import BasicInput from "../../../../../components/Forms/Input/BasicInput";

type Props = {
  currentOpacity?: number;
  setCurrentOpacity: Dispatch<SetStateAction<number | undefined>>;
};

const Opacity = ({ currentOpacity, setCurrentOpacity }: Props) => {
  const handleChangeOpacity = (mode: "add" | "subtract", opacity?: number) => {
    if (!opacity) {
      setCurrentOpacity(10);
      return;
    }

    if (opacity >= 100 && mode === "add") {
      setCurrentOpacity(100);
      return;
    }

    if (opacity <= 10 && mode === "subtract") {
      setCurrentOpacity(10);
      return;
    }

    if (mode === "add") {
      setCurrentOpacity(opacity + 10);
    }

    if (mode === "subtract") {
      setCurrentOpacity(opacity - 10);
    }
  };

  return (
    <div className="flex items-end gap-3 pt-3">
      <SquareIconButton
        iconName="IoRemove"
        size="medium"
        color="primary"
        onClick={() => {
          handleChangeOpacity("subtract", currentOpacity);
        }}
      />
      <BasicInput
        name="opacity_placeholder"
        label="Opacity"
        placeholder="Opacity"
        type="number"
        extendContainerStyle="w-full"
        labelStyle="text-brand-white"
        value={currentOpacity}
        step={5}
        disabled={true}
        extendStyle="disabled:!bg-brand-white"
      />
      <SquareIconButton
        iconName="IoAdd"
        size="medium"
        color="primary"
        onClick={() => {
          handleChangeOpacity("add", currentOpacity);
        }}
      />
    </div>
  );
};

export default Opacity;

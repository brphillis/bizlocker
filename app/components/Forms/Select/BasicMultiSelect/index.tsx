import { useState } from "react";
import ToolTip from "~/components/Indicators/ToolTip";
import type { ValidationErrors } from "~/utility/validate";

type Props = {
  id?: string;
  customWidth?: string;
  defaultValues?: SelectValue[] | null;
  extendStyle?: string;
  label: string;
  labelStyle?: string;
  name: string;
  selections: SelectValue[];
  validationErrors?: ValidationErrors;
  onChange?: (e: string[]) => void;
};

const BasicMultiSelect = ({
  id,
  customWidth,
  defaultValues,
  extendStyle,
  label,
  labelStyle,
  name,
  selections,
  validationErrors,
  onChange,
}: Props) => {
  const [selectedValues, setSelectedValues] = useState<string[] | undefined>(
    defaultValues ? defaultValues?.map((e) => e?.id.toString()) : undefined,
  );

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value,
    );
    setSelectedValues(selectedOptions);

    if (onChange) {
      setSelectedValues(selectedOptions);
    }
  };

  return (
    <div
      className={`form-control relative max-md:w-full ${
        customWidth ? customWidth : "w-[215px]"
      }`}
    >
      <label className="label">
        <span
          className={`label-text  ${
            labelStyle ? labelStyle : "text-brand-black"
          }`}
        >
          {label}
        </span>
      </label>

      <select
        className={`select text-brand-black/75 ${extendStyle}
        ${
          validationErrors?.hasOwnProperty(name)
            ? "select-error border !outline-none"
            : ""
        }
        `}
        onChange={handleOptionChange}
        value={selectedValues || undefined}
        multiple
      >
        {selections?.map(({ id, name }: SelectValue) => (
          <option
            className="checked:rounded-sm checked:bg-primary/75 checked:px-1 checked:text-brand-white"
            key={id}
            value={id}
          >
            {name}
          </option>
        ))}
      </select>

      {validationErrors?.hasOwnProperty(name) && (
        <ToolTip tip={validationErrors[name]} iconColor="text-error" />
      )}

      <input
        id={id}
        hidden
        readOnly
        name={name}
        value={JSON.stringify(selectedValues)}
      />
    </div>
  );
};

export default BasicMultiSelect;

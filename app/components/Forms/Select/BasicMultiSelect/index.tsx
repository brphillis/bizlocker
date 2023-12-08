import { useState } from "react";

type Props = {
  name: string;
  label: string;
  selections: SelectValue[];
  defaultValues?: SelectValue[] | null;
  styles?: string;
  customWidth?: string;
  labelColor?: string;
};

const BasicMultiSelect = ({
  name,
  label,
  selections,
  defaultValues,
  styles,
  customWidth,
  labelColor,
}: Props) => {
  const [selectedValues, setSelectedValues] = useState<string[] | undefined>(
    defaultValues ? defaultValues?.map((e) => e?.id.toString()) : undefined
  );

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value
    );
    setSelectedValues(selectedOptions);
  };

  return (
    <div
      className={`form-control max-md:w-full ${
        customWidth ? customWidth : "w-[215px]"
      }`}
    >
      <label className="label">
        <span
          className={`label-text  ${
            labelColor ? labelColor : "text-brand-black"
          }`}
        >
          {label}
        </span>
      </label>
      <select
        className={`select text-brand-black/75 ${styles ? styles : ""}`}
        onChange={handleOptionChange}
        value={selectedValues || undefined}
        multiple
      >
        {selections?.map(({ id, name }: SelectValue) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      <input
        hidden
        readOnly
        name={name}
        value={JSON.stringify(selectedValues)}
      />
    </div>
  );
};

export default BasicMultiSelect;

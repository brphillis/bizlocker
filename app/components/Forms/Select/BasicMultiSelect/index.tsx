import { useState } from "react";

type Props = {
  name: string;
  title: string;
  selections: Array<SelectValue>;
  defaultValues: Array<SelectValue>;
  styles?: string;
};

const BasicMultiSelect = ({
  name,
  title,
  selections,
  defaultValues,
  styles,
}: Props) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    defaultValues?.map((e) => e?.id.toString()) || undefined
  );

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value
    );
    setSelectedValues(selectedOptions);
  };

  return (
    <div className="form-control w-full sm:w-[215px]">
      <label className="label text-sm">{title}</label>
      <select
        className={`select text-brand-black ${styles ? styles : ""}`}
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

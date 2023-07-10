import { useState } from "react";

type Props = {
  brands: Brand[];
  valueToChange: Campaign;
  title?: string;
};

const SelectBrands = ({ brands, valueToChange, title }: Props) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    valueToChange?.brands?.map((e) => e?.name) || [""]
  );

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value
    );
    setSelectedBrands(selectedOptions);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{title ? title : "Categories"}</span>
      </label>
      <select
        className=" select w-[95vw] sm:w-[215px]"
        onChange={handleOptionChange}
        value={selectedBrands}
        multiple
      >
        {brands?.map(({ id, name }: Brand) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      <input
        hidden
        readOnly
        name="brands"
        value={JSON.stringify(selectedBrands)}
      />
    </div>
  );
};

export default SelectBrands;

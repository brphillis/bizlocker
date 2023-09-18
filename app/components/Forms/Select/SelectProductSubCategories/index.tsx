import { useState } from "react";

type Props = {
  productSubCategories: ProductSubCategory[];
  valueToChange: Product | Campaign;
  title?: string;
};

const SelectProductSubCategories = ({
  productSubCategories,
  valueToChange,
  title,
}: Props) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    valueToChange?.productSubCategories?.map((e) => e?.id.toString()) ||
      undefined
  );

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value
    );
    setSelectedCategories(selectedOptions);
  };

  return (
    <div className="form-control">
      <label className="label text-sm">{title ? title : "Categories"}</label>
      <select
        className=" select w-[95vw] sm:w-[215px]"
        onChange={handleCategoryChange}
        value={selectedCategories}
        multiple
      >
        {productSubCategories?.map(({ id, name }: ProductSubCategory) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      <input
        hidden
        readOnly
        name="productSubCategories"
        value={JSON.stringify(selectedCategories)}
      />
    </div>
  );
};

export default SelectProductSubCategories;

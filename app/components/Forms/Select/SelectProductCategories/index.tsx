import { useState } from "react";

type Props = {
  productCategories: ProductCategory[];
  valueToChange: Product | Campaign;
  title?: string;
};

const SelectProductCategories = ({
  productCategories,
  valueToChange,
  title,
}: Props) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    valueToChange?.productCategories?.map((e) => e?.id.toString()) || [""]
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
        {productCategories?.map(({ id, name }: ProductCategory) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      <input
        hidden
        readOnly
        name="productCategories"
        value={JSON.stringify(selectedCategories)}
      />
    </div>
  );
};

export default SelectProductCategories;

type Props = {
  productSubCategories: ProductSubCategory[];
  defaultValue?: string;
};

const SelectProductSubCategory = ({
  productSubCategories,
  defaultValue,
}: Props) => {
  return (
    <div className="form-control w-full sm:w-[215px]">
      <label className="label text-sm">Product Category</label>
      <select
        name="productSubCategory"
        className="select w-full text-brand-black/75"
        defaultValue={defaultValue}
      >
        <option value="">Select a Category</option>
        {productSubCategories?.map(({ id, name }: ProductSubCategory) => {
          return (
            <option key={"productSubCategory_" + id} value={id}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectProductSubCategory;

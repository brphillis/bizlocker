type Props = {
  productCategories: ProductCategory[];
  defaultValue?: string;
};

const SelectProductCategory = ({ productCategories, defaultValue }: Props) => {
  return (
    <div className="form-control w-full sm:w-[215px]">
      <label className="label">
        <span className="label-text">Product Category</span>
      </label>
      <select
        name="productCategory"
        className="select w-full text-brand-black/50"
        defaultValue={defaultValue}
      >
        <option value="">Select a Category</option>
        {productCategories?.map(({ id, name }: Brand) => {
          return (
            <option key={"productCategory_" + id} value={id}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectProductCategory;

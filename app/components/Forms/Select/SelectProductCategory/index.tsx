type Props = {
  productCategories: ProductCategory[];
  defaultValue?: string;
};

const SelectBrand = ({ productCategories, defaultValue }: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Product Category</span>
      </label>
      <select
        name="productCategory"
        className=" select w-[95vw] sm:w-[215px]"
        defaultValue={defaultValue}
      >
        <option value="">Select a Brand</option>
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

export default SelectBrand;

type Props = {
  productCategories: ProductCategory[];
  defaultValue?: string;
};

const SelectBrand = ({ productCategories, defaultValue }: Props) => {
  return (
    <div className="form-control">
      <label className="label text-sm">Root Category</label>
      <select
        name="productCategory"
        className=" select w-[95vw] text-brand-black/75 sm:w-[215px]"
        defaultValue={defaultValue}
      >
        <option value="">Select a Root Category</option>
        {productCategories?.map(({ id, name }: ProductCategory) => {
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

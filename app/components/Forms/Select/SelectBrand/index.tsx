type Props = {
  brands: Brand[];
  valueToChange?: Product;
};

const SelectBrand = ({ brands, valueToChange }: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Brand</span>
      </label>
      <select
        name="brand"
        className="select w-[95vw] sm:w-[215px]"
        defaultValue={valueToChange?.brand?.id || ""}
      >
        <option value="">Select a Brand</option>
        {brands?.map(({ id, name }: Brand) => {
          return (
            <option key={"brand_" + id} value={id}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectBrand;

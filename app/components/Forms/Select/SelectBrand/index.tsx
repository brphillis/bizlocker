type Props = {
  brands: Brand[];
  defaultValue?: string;
};

const SelectBrand = ({ brands, defaultValue }: Props) => {
  return (
    <div className="form-control">
      <label className="label text-sm">Brand</label>
      <select
        name="brand"
        className="select w-[95vw] sm:w-[215px]"
        defaultValue={defaultValue}
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

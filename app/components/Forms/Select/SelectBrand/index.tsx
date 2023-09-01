type Props = {
  brands: Brand[];
  defaultValue?: string;
};

const SelectBrand = ({ brands, defaultValue }: Props) => {
  return (
    <div className="form-control w-full sm:w-[215px]">
      <label className="label text-sm">Brand</label>
      <select
        name="brand"
        className="select w-full text-brand-black/75"
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

type Props = {
  rootCategories: RootCategory[];
  defaultValue?: string;
};

const SelectBrand = ({ rootCategories, defaultValue }: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Root Category</span>
      </label>
      <select
        name="rootCategory"
        className="select-bordered select w-[95vw] sm:w-[215px]"
        defaultValue={defaultValue}
      >
        <option value="">Select a Root Category</option>
        {rootCategories?.map(({ id, name }: Brand) => {
          return (
            <option key={"rootCategory_" + id} value={name}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectBrand;

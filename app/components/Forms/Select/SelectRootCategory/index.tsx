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
        className=" select w-[95vw] text-brand-black/75 sm:w-[215px]"
        defaultValue={defaultValue}
      >
        <option value="">Select a Root Category</option>
        {rootCategories?.map(({ id, name }: Brand) => {
          return (
            <option key={"rootCategory_" + id} value={id}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectBrand;

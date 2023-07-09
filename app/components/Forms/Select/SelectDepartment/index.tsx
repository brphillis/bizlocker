type Props = {
  departments: Department[];
  defaultValue?: string;
};

const SelectDepartment = ({ departments, defaultValue }: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Department</span>
      </label>
      <select
        name="department"
        className="select-bordered select w-[95vw] sm:w-[215px]"
        defaultValue={defaultValue || ""}
      >
        <option value="">Select a Department</option>
        {departments?.map(({ id, name }: Brand) => {
          return (
            <option key={"department_" + id} value={name}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectDepartment;

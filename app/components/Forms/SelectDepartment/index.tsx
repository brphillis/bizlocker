type Props = {
  departments: Department[];
  defaultValue: string;
  valueToChange: Campaign | RootCategory;
};

const SelectDepartment = ({ departments, valueToChange }: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Department</span>
      </label>
      <select
        name="department"
        className="select-bordered select w-[95vw] sm:w-[215px]"
        defaultValue={valueToChange?.department?.name}
        onChange={(e) => (valueToChange.department.name = e.target.value)}
      >
        {!departments && (
          <option disabled value="">
            No Departments
          </option>
        )}
        {departments?.map(({ id, name }: Department) => {
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

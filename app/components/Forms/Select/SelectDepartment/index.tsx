type Props = {
  departments: Department[];
  defaultValue?: string;
};

const SelectDepartment = ({ departments, defaultValue }: Props) => {
  return (
    <div className="form-control">
      <label className="label text-sm">Department</label>
      <select
        name="department"
        className="select w-[95vw] text-brand-black/75 sm:w-[215px]"
        defaultValue={defaultValue || ""}
      >
        <option value="">Select a Department</option>
        {departments?.map(({ id, name }: Department) => {
          return (
            <option key={"department_" + id} value={id}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectDepartment;

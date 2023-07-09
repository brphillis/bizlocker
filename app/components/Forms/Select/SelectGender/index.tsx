import type { Gender } from "@prisma/client";

type Props = {
  label: string;
  defaultValue: Gender;
};

const SelectGender = ({ defaultValue, label }: Props) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      <select
        name="gender"
        className="select-bordered select w-[95vw] sm:w-[215px]"
        defaultValue={defaultValue}
        placeholder="Select a Gender"
      >
        <option value="">Select gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="KIDS">Kids</option>
        <option value="UNISEX">Unisex</option>
      </select>
    </div>
  );
};

export default SelectGender;

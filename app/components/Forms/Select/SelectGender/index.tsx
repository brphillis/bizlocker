import type { Gender } from "@prisma/client";

type Props = {
  label: string;
  defaultValue?: Gender | string | null;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
  customWidth?: string;
  labelColor?: string;
};

const SelectGender = ({
  defaultValue,
  label,
  customWidth,
  labelColor,
  onChange,
}: Props) => {
  return (
    <div
      className={`form-control max-md:w-full ${
        customWidth ? customWidth : "w-[215px]"
      }`}
    >
      <label className="label">
        <span
          className={`label-text  ${
            labelColor ? labelColor : "text-brand-black"
          }`}
        >
          {label}
        </span>
      </label>

      <select
        name="gender"
        className="select w-full text-brand-black/75"
        defaultValue={defaultValue || "UNISEX"}
        placeholder="Select a Gender"
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      >
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="KIDS">Kids</option>
        <option value="UNISEX">Unisex</option>
      </select>
    </div>
  );
};

export default SelectGender;

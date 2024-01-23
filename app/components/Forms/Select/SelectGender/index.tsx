import type { Gender } from "@prisma/client";

type Props = {
  label: string;
  defaultValue?: Gender | string | null;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
  extendContainerStyle?: string;
  labelStyle?: string;
};

const SelectGender = ({
  defaultValue,
  label,
  extendContainerStyle,
  labelStyle,
  onChange,
}: Props) => {
  return (
    <div
      className={`form-control max-md:w-full w-[215px] ${extendContainerStyle}`}
    >
      <label className="label">
        <span
          className={`label-text  ${
            labelStyle ? labelStyle : "text-brand-black"
          }`}
        >
          {label}
        </span>
      </label>

      <select
        name="gender"
        className="select w-full text-brand-black/75"
        defaultValue={defaultValue || "UNISEX"}
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

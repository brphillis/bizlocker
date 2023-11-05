import ToolTip from "~/components/Indicators/ToolTip";

type Props = {
  name: string;
  label: string;
  selections: Array<SelectValue>;
  defaultValue?: string;
  placeholder: string;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
  customWidth?: string;
  labelColor?: string;
  validationErrors?: ValidationErrors;
};

const BasicSelect = ({
  name,
  label,
  selections,
  defaultValue,
  placeholder,
  customWidth,
  labelColor,
  validationErrors,
  onChange,
}: Props) => {
  return (
    <div
      className={`form-control relative max-md:w-full ${
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
        name={name}
        className={`select w-full text-brand-black/75
        ${
          validationErrors?.hasOwnProperty(name)
            ? "select-error border !outline-none"
            : ""
        }
        `}
        defaultValue={defaultValue}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      >
        <option value="">{placeholder}</option>
        {selections?.map(({ id, name }: SelectValue, index: number) => (
          <option key={`${name}_${id}_${index}`} value={id}>
            {name}
          </option>
        ))}
      </select>
      {validationErrors?.hasOwnProperty(name) && (
        <ToolTip tip={validationErrors[name]} iconColor="text-error" />
      )}
    </div>
  );
};

export default BasicSelect;

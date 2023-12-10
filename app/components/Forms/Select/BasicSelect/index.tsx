import ToolTip from "~/components/Indicators/ToolTip";

type Props = {
  customWidth?: string;
  defaultValue?: string | null;
  disabled?: boolean;
  id?: string;
  label: string;
  labelColor?: string;
  name: string;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  selections: Array<SelectValue>;
  validationErrors?: ValidationErrors;
};

const BasicSelect = ({
  customWidth,
  defaultValue,
  disabled,
  id,
  label,
  labelColor,
  name,
  onChange,
  placeholder,
  selections,
  validationErrors,
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
        id={id}
        disabled={disabled}
        name={name}
        className={`select w-full text-brand-black/75
        disabled:!border-base-100/50 disabled:!bg-base-100/50 disabled:!text-brand-black/50
        ${
          validationErrors?.hasOwnProperty(name)
            ? "select-error border !outline-none"
            : ""
        }
        `}
        defaultValue={defaultValue || undefined}
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

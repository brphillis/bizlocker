import type { ValidationErrors } from "~/utility/validate";
import ToolTip from "~/components/Indicators/ToolTip";

type Props = {
  extendContainerStyle?: string;
  defaultValue?: string | number | null;
  extendStyle?: string;
  disabled?: boolean;
  id?: string;
  label: string;
  labelStyle?: string;
  name: string;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  selections: Array<SelectValue> | null;
  validationErrors?: ValidationErrors;
};

const BasicSelect = ({
  extendContainerStyle,
  defaultValue,
  disabled,
  extendStyle,
  id,
  label,
  labelStyle,
  name,
  onChange,
  placeholder,
  selections,
  validationErrors,
}: Props) => {
  return (
    <div
      className={`form-control relative max-md:w-full w-[215px] ${extendContainerStyle}`}
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
        id={id}
        disabled={disabled}
        name={name}
        className={`select w-full
        text-brand-black/75 disabled:!border-base-100/50 disabled:!bg-base-100/50 disabled:!text-brand-black/50
        ${extendStyle}
        ${
          validationErrors && name in validationErrors
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
      {validationErrors && name in validationErrors && (
        <ToolTip tip={validationErrors[name]} iconColor="text-error" />
      )}
    </div>
  );
};

export default BasicSelect;

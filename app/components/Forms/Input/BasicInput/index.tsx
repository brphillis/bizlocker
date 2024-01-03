import type { ValidationErrors } from "~/utility/validate";
import ToolTip from "~/components/Indicators/ToolTip";

type Props = {
  customWidth?: string;
  decimals?: number;
  defaultValue?: any;
  disabled?: boolean;
  id?: string;
  label: string;
  labelStyle?: string;
  name: string;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  step?: number;
  extendStyle?: string;
  type: "text" | "number" | "date" | "password";
  validationErrors?: ValidationErrors;
  value?: number | string;
};

const BasicInput = ({
  customWidth,
  decimals,
  defaultValue,
  disabled,
  id,
  label,
  labelStyle,
  name,
  onChange,
  placeholder,
  step,
  extendStyle,
  type,
  validationErrors,
  value,
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
            labelStyle ? labelStyle : "text-brand-black"
          }`}
        >
          {label}
        </span>
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        step={step || undefined}
        value={value?.toString() || undefined}
        className={`input w-full text-brand-black/75
        disabled:!border-base-100/25 disabled:!bg-base-100/25 disabled:!text-brand-black/50
        ${
          validationErrors?.hasOwnProperty(name)
            ? "input-error border !outline-none"
            : ""
        } ${extendStyle}`}
        defaultValue={
          decimals
            ? parseFloat(defaultValue).toFixed(decimals)
            : defaultValue || undefined
        }
        onChange={(e) => {
          if (onChange) {
            if (decimals) {
              onChange(parseFloat(e.target.value).toFixed(decimals));
            } else {
              onChange(e.target.value);
            }
          }
        }}
      />
      {validationErrors?.hasOwnProperty(name) && (
        <ToolTip tip={validationErrors[name]} iconColor="text-error" />
      )}
    </div>
  );
};

export default BasicInput;

import type { ValidationErrors } from "~/utility/validate";
import ToolTip from "../../../../components/Indicators/ToolTip";

type Props = {
  extendContainerStyle?: string;
  decimals?: number;
  defaultValue?: unknown;
  disabled?: boolean;
  id?: string;
  label?: string;
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
  extendContainerStyle,
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
        extendContainerStyle ? extendContainerStyle : "w-[215px]"
      }`}
    >
      {label && (
        <label className="label">
          <span
            className={`label-text  ${
              labelStyle ? labelStyle : "text-brand-black"
            }`}
          >
            {label}
          </span>
        </label>
      )}
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
          validationErrors && name in validationErrors
            ? "input-error border !outline-none"
            : ""
        } ${extendStyle}`}
        defaultValue={
          decimals
            ? typeof defaultValue === "string"
              ? parseFloat(defaultValue).toFixed(decimals)
              : (defaultValue as number)
            : (defaultValue as string | number | readonly string[] | undefined)
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
      {validationErrors && name in validationErrors && (
        <ToolTip
          tip={validationErrors[name]}
          iconColor="text-error"
          direction="left"
        />
      )}
    </div>
  );
};

export default BasicInput;

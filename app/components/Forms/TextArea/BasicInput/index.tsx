import type { ValidationErrors } from "~/utility/validate";
import ToolTip from "~/components/Indicators/ToolTip";

type Props = {
  customWidth?: string;
  defaultValue?: any;
  disabled?: boolean;
  id?: string;
  label: string;
  labelStyle?: string;
  name: string;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  extendStyle?: string;
  validationErrors?: ValidationErrors;
};

const BasicTextArea = ({
  customWidth,
  defaultValue,
  disabled,
  id,
  label,
  labelStyle,
  name,
  onChange,
  placeholder,
  extendStyle,
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
            labelStyle ? labelStyle : "text-brand-black"
          }`}
        >
          {label}
        </span>
      </label>

      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        className={`textarea w-full rounded-sm text-brand-black/75
        disabled:!border-base-100/25 disabled:!bg-base-100/25 disabled:!text-brand-black/50
        ${
          validationErrors?.hasOwnProperty(name)
            ? "textarea-error border !outline-none"
            : ""
        } ${extendStyle}`}
        defaultValue={defaultValue}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      />
      {validationErrors?.hasOwnProperty(name) && (
        <ToolTip tip={validationErrors[name]} iconColor="text-error" />
      )}
    </div>
  );
};

export default BasicTextArea;

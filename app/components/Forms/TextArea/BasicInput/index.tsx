import type { ValidationErrors } from "~/utility/validate";
import ToolTip from "~/components/Indicators/ToolTip";

type Props = {
  customWidth?: string;
  defaultValue?: any;
  disabled?: boolean;
  id?: string;
  label: string;
  labelColor?: string;
  name: string;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  styles?: string;
  validationErrors?: ValidationErrors;
};

const BasicTextArea = ({
  customWidth,
  defaultValue,
  disabled,
  id,
  label,
  labelColor,
  name,
  onChange,
  placeholder,
  styles,
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
        } ${styles}`}
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

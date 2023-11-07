import ToolTip from "~/components/Indicators/ToolTip";

type Props = {
  label: string;
  type: "text" | "number" | "date";
  name: string;
  placeholder: string;
  defaultValue?: any;
  validationErrors?: ValidationErrors;
  styles?: string;
  customWidth?: string;
  labelColor?: string;
  disabled?: boolean;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
};

const BasicInput = ({
  label,
  type,
  name,
  placeholder,
  defaultValue,
  validationErrors,
  styles,
  customWidth,
  labelColor,
  disabled,
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
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`input w-full text-brand-black/75
        disabled:bg-base-100/50
        ${
          validationErrors?.hasOwnProperty(name)
            ? "input-error border !outline-none"
            : ""
        } ${styles}`}
        defaultValue={defaultValue || ""}
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

export default BasicInput;

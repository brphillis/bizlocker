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
  type: "text" | "number" | "date";
  validationErrors?: ValidationErrors;
};

const BasicInput = ({
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
  type,
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
      <input
        id={id}
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

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
  onChange,
}: Props) => {
  return (
    <div
      className={`form-control max-md:w-full ${
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
        className={`input w-full text-brand-black/75 ${
          validationErrors?.hasOwnProperty(name) ? "input-error border-2" : ""
        } ${styles}`}
        defaultValue={defaultValue || ""}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      />
      {validationErrors?.hasOwnProperty("contentSelection") && (
        <label className="label">
          <span className="label-text-alt">
            {validationErrors["contentSelection"]}
          </span>
        </label>
      )}
    </div>
  );
};

export default BasicInput;

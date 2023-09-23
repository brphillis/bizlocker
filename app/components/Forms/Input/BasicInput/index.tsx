type Props = {
  label: string;
  type: "text" | "number" | "date";
  name: string;
  placeholder: string;
  defaultValue?: any;
  validationErrors?: ValidationErrors;
};

const BasicInput = ({
  label,
  type,
  name,
  placeholder,
  defaultValue,
  validationErrors,
}: Props) => {
  return (
    <div className="form-control w-full sm:w-[215px]">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={`input w-full ${
          validationErrors?.hasOwnProperty(name) ? "input-error border-2" : ""
        }`}
        defaultValue={defaultValue || ""}
      />
      {validationErrors?.hasOwnProperty(name) && (
        <label className="label">
          <span className="label-text-alt">{validationErrors.name}</span>
        </label>
      )}
    </div>
  );
};

export default BasicInput;

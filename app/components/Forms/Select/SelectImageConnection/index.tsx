type Props = {
  label: string;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
  customWidth?: string;
  labelColor?: string;
};

const SelectImageConnection = ({
  label,
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

      <select
        name="connectionType"
        className="select w-full text-brand-black/75"
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      >
        <option value="">Select a Connection</option>
        <option value="promotion">Promotion</option>
        <option value="campaign">Campaign</option>
        <option value="brand">Brand</option>
        <option value="product">Product</option>
        <option value="article">Article</option>
        <option value="disconnected">Disconnected</option>
      </select>
    </div>
  );
};

export default SelectImageConnection;

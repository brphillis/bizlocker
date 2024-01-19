type Props = {
  label: string;
  type: "order" | "approval";
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
  extendContainerStyle?: string;
  labelStyle?: string;
};

const SelectStatus = ({
  label,
  type,
  extendContainerStyle,
  labelStyle,
  onChange,
}: Props) => {
  return (
    <div
      className={`form-control max-md:w-full w-[215px] ${extendContainerStyle}`}
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
        name="status"
        className="select w-full text-brand-black/75"
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      >
        {type === "order" && (
          <>
            <option value="">Select a Status</option>
            <option value="created">Created</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="complete">Complete</option>
            <option value="cancelled">Cancelled</option>
          </>
        )}

        {type === "approval" && (
          <>
            <option value="">Select a Status</option>
            <option value="created">Created</option>
            <option value="approved">Approved</option>
            <option value="processing">Processing</option>
            <option value="complete">Complete</option>
            <option value="cancelled">Cancelled</option>
          </>
        )}
      </select>
    </div>
  );
};

export default SelectStatus;

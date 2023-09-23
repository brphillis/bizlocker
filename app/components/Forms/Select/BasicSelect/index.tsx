type Props = {
  name: string;
  label: string;
  selections: Array<SelectValue>;
  defaultValue?: string;
  placeholder: string;
};

const BasicSelect = ({
  name,
  label,
  selections,
  defaultValue,
  placeholder,
}: Props) => {
  return (
    <div className="form-control w-[215px] max-md:w-full">
      <label className="label text-sm">{label}</label>
      <select name={name} className="select w-full" defaultValue={defaultValue}>
        <option value="">{placeholder}</option>
        {selections?.map(({ id, name }: SelectValue) => {
          return (
            <option key={`${name}_` + id} value={id}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default BasicSelect;

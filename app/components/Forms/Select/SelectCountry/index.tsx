import { ISO3166Countries } from "~/utility/countryList";

type Props = {
  defaultValue: string | undefined;
};

const index = ({ defaultValue }: Props) => {
  return (
    <div className="form-control">
      <label className="label text-sm">Country</label>
      <select
        name="country"
        className=" select w-[95vw] sm:w-[215px]"
        defaultValue={defaultValue}
        placeholder="Select a Value"
      >
        <option value="">Select a Country</option>
        {ISO3166Countries?.map(({ code, name }: CountrySelect) => {
          return (
            <option key={code + name} value={code}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default index;

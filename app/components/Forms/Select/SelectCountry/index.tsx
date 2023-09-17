import { ISO3166Countries } from "~/utility/countryList";

type Props = {
  defaultValue: string | undefined;
  styles?: string;
};

const index = ({ defaultValue, styles }: Props) => {
  return (
    <div className={`form-control max-sm:w-[95vw] sm:w-[215px] ${styles}`}>
      <label className="label text-sm">Country</label>
      <select
        name="country"
        className="select w-full"
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

import type { ValidationErrors } from "~/utility/validate";
import { type CountrySelect, ISO3166Countries } from "~/utility/countryList";
import ToolTip from "~/components/Indicators/ToolTip";

type Props = {
  defaultValue?: string | null;
  validationErrors?: ValidationErrors;
  styles?: string;
};

const SelectCountry = ({ defaultValue, validationErrors, styles }: Props) => {
  return (
    <div
      className={`form-control relative max-sm:w-[95vw] sm:w-[215px] ${styles}`}
    >
      <label className="label text-sm">Country</label>
      <select
        name="country"
        className={`select w-full ${
          validationErrors?.hasOwnProperty("country")
            ? "select-error border !outline-none"
            : ""
        }`}
        defaultValue={defaultValue || undefined}
        placeholder="Select a Value"
      >
        {ISO3166Countries?.map(({ code, name }: CountrySelect) => {
          return (
            <option key={code + name} value={code}>
              {name}
            </option>
          );
        })}
      </select>

      {validationErrors?.hasOwnProperty("country") && (
        <ToolTip tip={validationErrors["country"]} iconColor="text-error" />
      )}
    </div>
  );
};

export default SelectCountry;

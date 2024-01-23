import type { ValidationErrors } from "~/utility/validate";
import { type CountrySelect, ISO3166Countries } from "~/utility/countryList";
import ToolTip from "~/components/Indicators/ToolTip";

type Props = {
  defaultValue?: string | null;
  validationErrors?: ValidationErrors;
  extendStyle?: string;
};

const SelectCountry = ({
  defaultValue,
  validationErrors,
  extendStyle,
}: Props) => {
  return (
    <div
      className={`form-control relative max-sm:w-[95vw] sm:w-[215px] ${extendStyle}`}
    >
      <div className="label text-sm">Country</div>
      <select
        name="country"
        className={`select w-full ${
          validationErrors && "country" in validationErrors
            ? "select-error border !outline-none"
            : ""
        }`}
        defaultValue={defaultValue || undefined}
      >
        {ISO3166Countries?.map(({ code, name }: CountrySelect) => {
          return (
            <option key={code + name} value={code}>
              {name}
            </option>
          );
        })}
      </select>

      {validationErrors && "country" in validationErrors && (
        <ToolTip tip={validationErrors["country"]} iconColor="text-error" />
      )}
    </div>
  );
};

export default SelectCountry;

import type { ValidationErrors } from "~/utility/validate";
import { useState } from "react";
import ToolTip from "../../../../components/Indicators/ToolTip";
import { ISO3166Countries } from "../../../../utility/countryList";

type Props = {
  label: string;
  type: "text" | "number" | "date";
  name: string;
  placeholder: string;
  defaultValue?: string;
  validationErrors?: ValidationErrors;
  extendStyle?: string;
  extendContainerStyle?: string;
  labelStyle?: string;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
};

type PhoneNumber = {
  areacode: string;
  dialnumber: string;
};

const PhoneInput = ({
  label,
  type,
  name,
  placeholder,
  defaultValue,
  validationErrors,
  extendStyle,
  extendContainerStyle,
  labelStyle,
}: Props) => {
  const [phoneNumber, setPhoneNumber] = useState<PhoneNumber>({
    areacode: defaultValue ? defaultValue.split(" ")[0] + " " : "61 ",
    dialnumber: defaultValue ? defaultValue.split(" ")[1] : "",
  });

  const updateAreaCode = (newAreaCode: string) => {
    setPhoneNumber((prevPhoneNumber) => ({
      ...prevPhoneNumber,
      areacode: newAreaCode,
    }));
  };

  const updateDialNumber = (newNumber: string) => {
    setPhoneNumber((prevPhoneNumber) => ({
      ...prevPhoneNumber,
      dialnumber: newNumber,
    }));
  };

  return (
    <div
      className={`form-control relative max-md:w-full w-[215px] ${extendContainerStyle}`}
    >
      <input
        type="hidden"
        name={name ? name : "image"}
        value={phoneNumber.areacode + phoneNumber.dialnumber}
      />

      <label className="label">
        <span
          className={`label-text  ${
            labelStyle ? labelStyle : "text-brand-black"
          }`}
        >
          {label}
        </span>
      </label>

      <div className="flex flex-row">
        <select
          className="!border-red w-[30%] max-w-[50px] appearance-none border-2 bg-base-100 pl-2 pr-0 !text-xs"
          defaultValue={phoneNumber.areacode}
          onChange={(e) => updateAreaCode(e.target.value)}
        >
          {ISO3166Countries.map((e) => {
            if (e.phoneCode) {
              return (
                <option
                  key={"phoneCodeSelect_" + e.phoneCode}
                  value={e.phoneCode + " "}
                >
                  {"+" + e.phoneCode}
                </option>
              );
            } else return null;
          })}
        </select>

        <input
          type={type}
          placeholder={placeholder}
          className={`input w-full text-brand-black/75 ${
            validationErrors && name in validationErrors
              ? "input-error border !outline-none"
              : ""
          } ${extendStyle}`}
          defaultValue={phoneNumber.dialnumber}
          onChange={(e) => updateDialNumber(e.target.value)}
        />
      </div>

      {validationErrors && name in validationErrors && (
        <ToolTip tip={validationErrors[name]} iconColor="text-error" />
      )}
    </div>
  );
};

export default PhoneInput;

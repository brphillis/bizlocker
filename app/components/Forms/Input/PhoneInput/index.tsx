import type { ValidationErrors } from "~/utility/validate";
import { useState } from "react";
import ToolTip from "~/components/Indicators/ToolTip";
import { ISO3166Countries } from "~/utility/countryList";

type Props = {
  label: string;
  type: "text" | "number" | "date";
  name: string;
  placeholder: string;
  defaultValue?: any;
  validationErrors?: ValidationErrors;
  extendStyle?: string;
  customWidth?: string;
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
  customWidth,
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
      className={`form-control relative max-md:w-full ${
        customWidth ? customWidth : "w-[215px]"
      }`}
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
            validationErrors?.hasOwnProperty(name)
              ? "input-error border !outline-none"
              : ""
          } ${extendStyle}`}
          defaultValue={phoneNumber.dialnumber}
          onChange={(e) => updateDialNumber(e.target.value)}
        />
      </div>
      {validationErrors?.hasOwnProperty(name) && (
        <ToolTip tip={validationErrors[name]} iconColor="text-error" />
      )}
    </div>
  );
};

export default PhoneInput;

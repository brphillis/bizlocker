import { useState } from "react";

type Props = {
  defaultValue: boolean;
};

const Toggle = ({ defaultValue }: Props) => {
  const [isActive, setIsActive] = useState<boolean>(defaultValue);

  return (
    <>
      <label className="max-xs:mt-0 label relative mt-[5px] h-1 cursor-pointer">
        <input
          type="checkbox"
          className="toggle toggle-success toggle-sm ml-3"
          checked={isActive ? true : false}
          onChange={(e) => setIsActive(e.target.checked ? true : false)}
        />
        <span className="label-text ml-3">Active</span>
      </label>
      {isActive && (
        <input name="isActive" value={isActive ? "true" : ""} readOnly hidden />
      )}
    </>
  );
};

export default Toggle;

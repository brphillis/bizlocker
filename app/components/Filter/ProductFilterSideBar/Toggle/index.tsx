import { useSearchParams, useSubmit } from "@remix-run/react";

type Props = {
  label: string;
  searchParam: string;
  isActive: boolean;
};

const Toggle = ({ label, searchParam, isActive }: Props) => {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  return (
    <button
      type="button"
      className="flex cursor-pointer justify-between"
      onClick={() => {
        if (isActive) {
          searchParams.delete(searchParam);
        } else {
          searchParams.set(searchParam, "true");
        }
        submit(searchParams, {
          method: "GET",
          preventScrollReset: true,
        });
      }}
    >
      <span className="label-text mr-6">{label}</span>
      <input
        type="checkbox"
        className="toggle toggle-sm !self-end"
        checked={isActive ? true : false}
        readOnly
      />
    </button>
  );
};

export default Toggle;

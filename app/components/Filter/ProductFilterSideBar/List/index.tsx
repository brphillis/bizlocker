import { useSearchParams, useSubmit } from "@remix-run/react";

type Props = {
  label: string;
  listValues: string[];
  searchParam: string;
};

const List = ({ label, listValues, searchParam }: Props) => {
  const [searchParams] = useSearchParams();
  const searchedValue = searchParams.get(searchParam);
  const submit = useSubmit();

  return (
    <li>
      {/* eslint-disable-next-line */}
      <details
        open={searchedValue ? listValues.includes(searchedValue) : false}
        onClick={(e) => searchedValue && e.preventDefault()}
      >
        <summary className="rounded-none font-semibold text-brand-black">
          {label}
        </summary>
        <div className="pb-3 max-h-[500px] overflow-y-auto scrollbar-hide">
          {listValues?.map((value: string) => {
            return (
              <button
                key={searchParam + "_sideFilter_" + value}
                type="button"
                className="ml-3 flex cursor-pointer items-center gap-2 py-1 pt-3"
                onClick={() => {
                  const selectedValue = searchedValue;
                  if (selectedValue === value) {
                    searchParams.delete(searchParam);
                  } else {
                    searchParams.set(searchParam, value);
                  }
                  submit(searchParams, {
                    method: "GET",
                    preventScrollReset: true,
                  });
                }}
              >
                <input
                  id={"checkBox_brand_" + value}
                  type="checkbox"
                  checked={searchedValue === value}
                  className="checkbox checkbox-xs"
                  readOnly
                />
                <p>{value}</p>
              </button>
            );
          })}
        </div>
      </details>
    </li>
  );
};

export default List;

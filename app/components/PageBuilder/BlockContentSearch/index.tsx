import { useSearchParams, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import { getBlockContentTypes } from "~/utility/blockMaster";

type Props = {
  selectedBlock: BlockName | undefined;
  defaultValue: BlockContentType | undefined;
  setContentType: Function;
};

const BlockContentSearch = ({
  selectedBlock,
  defaultValue,
  setContentType,
}: Props) => {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>();

  const handleSearchSubmit = (contentType?: string, name?: string) => {
    const searchForm = new FormData();
    searchForm.set("_action", "search");

    if (contentType) {
      searchParams.set("contentType", contentType);
    }

    const selectedContentType = searchParams.get("contentType");

    if (selectedContentType) {
      searchForm.set("contentType", selectedContentType as string);
      if (name) {
        searchForm.set("name", name as string);
      }
      submit(searchForm, { method: "POST" });
    }
  };

  useEffect(() => {
    if (defaultValue) {
      setContentType(defaultValue);
    }
  }, [defaultValue, setContentType]);

  return (
    <>
      {(selectedBlock === "banner" ||
        selectedBlock === "tile" ||
        selectedBlock === "hero") && (
        <div className="mt-10 hidden w-full flex-wrap justify-start gap-3 rounded-sm bg-brand-white/20 px-4 pb-4 pt-2 max-md:px-2 [&:has(div)]:flex">
          <span className="absolute -mt-10 block font-bold">
            Content Selection
          </span>
          <div className="flex flex-wrap items-end gap-3">
            <div className="form-control text-brand-black">
              <label className="label text-sm text-brand-white">
                Content Selection
              </label>
              <select
                name="contentType"
                className=" select w-[95vw] max-w-full sm:w-[215px]"
                defaultValue={defaultValue}
                placeholder="Select a Type"
                onChange={(e) => {
                  handleSearchSubmit(e.target.value, undefined);
                  setContentType(e.target.value);
                }}
              >
                <option value="">Select Content Type</option>
                {getBlockContentTypes(selectedBlock).map(
                  (contentType: string) => {
                    return (
                      <option
                        key={"contentTypeSelect_" + contentType}
                        value={contentType}
                      >
                        {capitalizeFirst(contentType)}
                      </option>
                    );
                  }
                )}
              </select>
            </div>

            <BasicInput
              labelColor="text-brand-white"
              label="Search Content"
              name="name"
              placeholder="Search Name"
              type="text"
              onChange={(e) => {
                setSearchValue(e as string);
              }}
            />

            <button
              className="btn-primary btn-sm !h-[42px] rounded-sm"
              onClick={() => handleSearchSubmit(undefined, searchValue)}
            >
              Search
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BlockContentSearch;

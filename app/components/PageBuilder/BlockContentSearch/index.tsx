import { useSearchParams, useSubmit } from "@remix-run/react";
import { useEffect } from "react";
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
        <div className=" w-full py-3">
          <p className="pb-3 font-semibold text-brand-white">Content Options</p>
          <div className="flex flex-wrap gap-3">
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
                handleSearchSubmit(undefined, e as string);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BlockContentSearch;

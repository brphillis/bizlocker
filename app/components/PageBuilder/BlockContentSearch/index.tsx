import { useSearchParams, useSubmit } from "@remix-run/react";

type Props = {
  selectedBlock: BlockName | undefined;
  defaultValue: string;
};

const BlockContentSearch = ({ selectedBlock, defaultValue }: Props) => {
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

  return (
    <>
      {(selectedBlock === "banner" || selectedBlock === "tile") && (
        <div className=" w-full  px-2 py-3">
          <p className="px-1 pb-3 font-semibold text-brand-white">
            Content Options
          </p>
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
                }}
              >
                <option value="">Select Content Type</option>
                <option value="promotion">Promotion</option>
                <option value="campaign">Campaign</option>
              </select>
            </div>

            <div className="flex flex-row gap-6">
              <div className="form-control w-[95vw] sm:w-[215px]">
                <label className="label text-sm text-brand-white">
                  Search Content
                </label>
                <input
                  name="name"
                  placeholder="Search Name"
                  className="input-bordered input w-[95vw] text-brand-black/75 sm:w-[215px]"
                  type="text"
                  onChange={(e) => {
                    handleSearchSubmit(undefined, e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlockContentSearch;

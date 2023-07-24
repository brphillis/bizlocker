import { useSearchParams, useSubmit } from "@remix-run/react";

type Props = {
  selectedBlock: BlockName | undefined;
  defaultValue: string;
};

const BlockContentSearch = ({ selectedBlock, defaultValue }: Props) => {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  const handleSearchSubmit = (contentType?: string, name?: string) => {
    console.log("NAME", name, "CONTENT TYPE", contentType);
    const searchForm = new FormData();
    searchForm.set("_action", "search");

    if (contentType && name) {
      searchParams.set("contentType", contentType);
      const searchType = searchParams.get("contentType");
      searchForm.set("contentType", searchType as string);
    }

    if (contentType && name) {
      searchParams.set("name", name);
      const searchType = searchParams.get("contentType");
      const searchName = searchParams.get("name");
      searchForm.set("contentType", searchType as string);
      searchForm.set("name", searchName as string);
      submit(searchForm, { method: "POST" });
      console.log("Triggered");
    }
  };

  return (
    <>
      {(selectedBlock === "banner" || selectedBlock === "tile") && (
        <div className=" w-full bg-base-300/50 px-2 py-3">
          <p className="px-1 pb-3 font-semibold text-brand-black">
            Content Options
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="form-control text-brand-black">
              <label className="label">
                <span className="label-text">Content Selection</span>
              </label>
              <select
                name="contentType"
                className=" select w-[95vw] max-w-full sm:w-[215px]"
                defaultValue={defaultValue}
                placeholder="Select a Type"
                onChange={(e) => {
                  handleSearchSubmit(e.target.value, "saba");
                }}
              >
                <option value="">Select Content Type</option>
                <option value="promotion">Promotion</option>
                <option value="campaign">Campaign</option>
              </select>
            </div>

            <div className="flex flex-row gap-6">
              <div className="form-control w-[95vw] sm:w-[215px]">
                <label className="label">
                  <span className="label-text">Search Content</span>
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

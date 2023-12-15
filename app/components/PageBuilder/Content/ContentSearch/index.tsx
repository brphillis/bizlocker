import type { PreviewPage } from "@prisma/client";
import type { BlockContentType, BlockName } from "~/utility/blockMaster/types";
import { useSubmit } from "@remix-run/react";
import { useState } from "react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import { getBlockContentTypes } from "~/utility/blockMaster/blockMaster";

type Props = {
  selectedBlock: BlockName | undefined;
  previewPage: PreviewPage;
  contentType: BlockContentType | undefined;
  setContentType: Function;
};

const ContentSearch = ({
  selectedBlock,
  previewPage,
  contentType,
  setContentType,
}: Props) => {
  const submit = useSubmit();
  const [searchValue, setSearchValue] = useState<string>();

  const handleSearchSubmit = (contentType?: string, name?: string) => {
    const searchForm = new FormData();
    searchForm.set("_action", "search");

    if (contentType) {
      searchForm.set("contentType", contentType);
    }

    if (name) {
      searchForm.set("name", name as string);
    }

    searchForm.set("previewPageId", previewPage.id.toString());

    submit(searchForm, { method: "POST" });
  };

  const shouldDisplay = () => {
    const blockTypes = ["banner", "tile", "map", "hero"];

    if (selectedBlock && blockTypes.includes(selectedBlock)) {
      return true;
    } else return false;
  };

  return (
    <>
      {selectedBlock && shouldDisplay() && (
        <div className="mt-10 hidden w-full flex-wrap justify-start gap-3 rounded-sm bg-brand-white/20 px-4 pb-4 pt-2 max-md:px-2 [&:has(div)]:flex">
          <span className="absolute -mt-10 block font-bold">
            Content Selection
          </span>
          <div className="flex flex-wrap items-end justify-start gap-3 max-md:justify-end">
            <div className="form-control w-[215px] text-brand-black max-md:w-full">
              <label className="label text-sm text-brand-white">
                Content Type
              </label>
              <select
                name="contentType"
                className="select w-full"
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
              type="button"
              className="btn-primary btn-sm !h-[42px] rounded-sm bg-primary hover:bg-primary-dark max-md:mt-3"
              onClick={() => {
                handleSearchSubmit(contentType, searchValue);
              }}
            >
              Search
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentSearch;

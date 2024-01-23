import type { PreviewPage } from "@prisma/client";
import type { BlockContentType, BlockName } from "~/utility/blockMaster/types";
import { useNavigate, useSubmit } from "@remix-run/react";
import { useState } from "react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import {
  blockMaster,
  getBlockContentTypes,
} from "~/utility/blockMaster/blockMaster";

type Props = {
  selectedBlock: BlockName | undefined;
  previewPage: PreviewPage;
  contentType: BlockContentType | undefined;
  setContentType: React.Dispatch<
    React.SetStateAction<BlockContentType | undefined>
  >;
};

const ContentSearch = ({
  selectedBlock,
  previewPage,
  contentType,
  setContentType,
}: Props) => {
  const navigate = useNavigate();
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
    const currentBlockData = blockMaster.find((e) => e.name === selectedBlock);

    if (currentBlockData?.maxContentItems) {
      return true;
    } else return false;
  };

  return (
    <>
      {selectedBlock && shouldDisplay() && (
        <div className="relative hidden w-full flex-wrap justify-start max-md:justify-center gap-3 rounded-sm bg-brand-white/20 px-4 pb-4 pt-2 max-md:px-2 [&:has(div)]:flex">
          <div className="flex flex-wrap items-end justify-start gap-3 max-md:justify-end">
            <div className="form-control w-[215px] text-brand-black max-md:w-full">
              <div className="label text-sm text-brand-white">Content Type</div>
              <select
                id="PageBuilderContentSearchSelect"
                name="contentType"
                className="select w-full"
                onChange={(e) => {
                  handleSearchSubmit(e.target.value, undefined);
                  setContentType(e.target.value as BlockContentType);
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
                  },
                )}
              </select>
            </div>

            <BasicInput
              labelStyle="text-brand-white"
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

            {contentType && (
              <button
                type="button"
                className="btn-primary btn-sm !h-[42px] rounded-sm bg-primary hover:bg-primary-dark max-md:mt-3"
                onClick={() => {
                  navigate({
                    pathname: contentType,
                    search: "?contentId=add",
                  });
                }}
              >
                Add
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ContentSearch;

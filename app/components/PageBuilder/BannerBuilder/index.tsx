import { useRef, useState } from "react";
import { capitalizeFirst } from "~/utility/stringHelpers";
import { IoCaretForwardCircleSharp } from "react-icons/io5";
import SearchInput from "~/components/Forms/Input/SearchInput";
import { getBlocks } from "~/utility/blockHelpers";
import { Form, useSubmit } from "@remix-run/react";

type Props = {
  homePage: Page;
  searchResults: Campaign[] | Promotion[];
};

const HomePageBannerBuilder = ({ homePage, searchResults }: Props) => {
  const submit = useSubmit();

  const blocks = getBlocks(homePage);
  const banner = blocks[0];

  const searchFormRef = useRef<HTMLFormElement>(null);
  const [editingBanner, setEditingBanner] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Campaign | Promotion>();

  const handleSearchSubmit = () => {
    if (searchFormRef.current) {
      const searchForm = new FormData(searchFormRef.current);
      searchForm.set("_action", "search");
      submit(searchForm, { method: "POST" });
    }
  };

  const handleUpdateSubmit = () => {
    if (searchFormRef.current) {
      const searchForm = new FormData(searchFormRef.current);
      const contentType = searchForm.get("contentType");

      const updateForm = new FormData();
      updateForm.set("_action", "update");
      updateForm.set("pageId", homePage.id.toString() || "");
      updateForm.set("itemIndex", "0");
      updateForm.set("blockName", "banner");
      updateForm.set("contentType", contentType as string);
      updateForm.set("contentData", JSON.stringify(selectedItem) as string);

      submit(updateForm, {
        method: "POST",
      });

      setEditingBanner(false);
    }
  };

  return (
    <>
      {!editingBanner && (
        <div className="flex w-full flex-col items-center">
          <div className="divider w-full" />
          <div className="scrollbar-hide w-full overflow-x-auto">
            <table className="table max-w-full">
              <thead>
                <tr>
                  <th className="w-1/3">Name</th>
                  <th className="w-1/3">Type</th>
                  <th className="w-1/3"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{capitalizeFirst(banner?.name)}</td>
                  <td>{capitalizeFirst(blocks[0]?.type)}</td>
                  <td className="flex justify-center">
                    <button
                      type="submit"
                      className="btn-primary btn-md"
                      onClick={() => {
                        setSelectedItem(blocks[0].content[0]);
                        setEditingBanner(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingBanner && (
        <div className="max-w-screen my-3 flex w-full flex-col gap-6">
          <Form
            method="POST"
            ref={searchFormRef}
            className="flex w-full flex-row flex-wrap justify-center gap-3 sm:justify-start"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Content Type</span>
              </label>
              <select
                name="contentType"
                className="select-bordered select w-[95vw] sm:w-[215px]"
                defaultValue="Select Content Type"
                placeholder="Select a Type"
                onChange={handleSearchSubmit}
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
                <SearchInput name="name" placeholder="Name" />
              </div>
            </div>
          </Form>

          {searchResults && (
            <div className="w-full overflow-x-auto">
              <div className="divider my-0 w-full py-0" />
              <p className="my-3 text-sm font-bold">Select an Item</p>
              <table className="table-sm table max-w-full">
                <thead>
                  <tr>
                    <th className="w-1/4"></th>
                    <th className="w-1/4">Name</th>
                    <th className="w-1/4">Created</th>
                    <th className="w-1/4">Go To</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults?.map(
                    ({ name, createdAt }: Promotion | Campaign, index) => {
                      return (
                        <tr
                          key={"promotionOrCampaign_" + name + index}
                          className="hover cursor-pointer"
                          onClick={() => setSelectedItem(searchResults[index])}
                        >
                          <td className="w-1/4">{index + 1}</td>
                          <td className="w-1/4">{capitalizeFirst(name)}</td>
                          <td className="w-1/4">
                            {new Date(createdAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>
                          <td className="w-1/4">
                            <div className="ml-2">
                              <IoCaretForwardCircleSharp />
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}

          {selectedItem && (
            <div className="max-w-3xl overflow-x-auto">
              <div className="divider mt-0 w-full pt-0" />
              <p className="my-3 text-sm font-bold">Selected Item</p>
              <table className="table-sm table max-w-full">
                <thead>
                  <tr>
                    <th className="w-1/4"></th>
                    <th className="w-1/4">Name</th>
                    <th className="w-1/4">Created</th>
                    <th className="w-1/4">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover cursor-pointer">
                    <td className="w-1/4">1</td>
                    <td className="w-1/4">{selectedItem.name}</td>
                    <td className="w-1/4">
                      {new Date(selectedItem.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="w-1/4">
                      <div
                        className="ml-2"
                        onClick={() => setSelectedItem(undefined)}
                      >
                        <IoCaretForwardCircleSharp />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="divider my-0 w-full py-0" />

          <div className="flex flex-row justify-center gap-3">
            <button
              type="button"
              className="btn-primary btn-md"
              onClick={() => {
                setEditingBanner(false);
              }}
            >
              Back
            </button>

            <button
              type="button"
              className="btn-primary btn-md"
              onClick={handleUpdateSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePageBannerBuilder;

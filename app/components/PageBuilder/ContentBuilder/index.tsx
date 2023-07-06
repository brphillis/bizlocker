import { useRef, useState } from "react";
import { capitalizeFirst } from "~/utility/stringHelpers";
import { IoCaretForwardCircleSharp } from "react-icons/io5";
import { Form, useSearchParams, useSubmit } from "@remix-run/react";
import SearchInput from "~/components/Forms/Input/SearchInput";
import { getBlocks } from "~/utility/blockHelpers";

type Props = {
  page: Page;
  searchResults: Campaign[] | Promotion[];
};

const ContentBuilder = ({ page, searchResults }: Props) => {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const searchFormRef = useRef<HTMLFormElement>(null);

  const [editingContent, setEditingContent] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<(Campaign | Promotion)[]>(
    []
  );

  const blocks = getBlocks(page);

  const selectItem = (item: Campaign | Promotion) => {
    const blockName = searchParams.get("blockName");

    if (blockName === "banner" && selectedItems.length >= 1) {
      // BANNER BLOCK CAN ONLY HAVE 1 ITEM
      return;
    }

    if (blockName === "tile" && selectedItems.length >= 4) {
      // TILE BLOCK CAN HAVE MAX OF 4 ITEMS
      return;
    }

    setSelectedItems((prevSelectedItems: (Campaign | Promotion)[]) => [
      ...prevSelectedItems,
      item,
    ]);
  };

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
      const blockName = searchForm.get("blockName");
      const contentType = searchForm.get("contentType");

      const updateForm = new FormData();
      updateForm.set("_action", "update");
      updateForm.set("pageId", page.id.toString() || "");
      updateForm.set("itemIndex", editingIndex.toString());
      updateForm.set("blockName", blockName as string);
      updateForm.set("contentType", contentType as string);
      updateForm.set("contentData", JSON.stringify(selectedItems) as string);

      submit(updateForm, {
        method: "POST",
      });

      setEditingContent(false);
      setSelectedItems([]);
    }
  };

  return (
    <>
      {!editingContent && (
        <div className="scrollbar-hide w-[600px] overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-1/4"></th>
                <th className="w-1/4">Block</th>
                <th className="w-1/4">Type</th>
                <th className="w-1/4"></th>
              </tr>
            </thead>
            <tbody>
              {blocks
                ?.sort((a: Block, b: Block) => a.order - b.order)
                .map((e: Block, index) => {
                  if (index !== 0 && e.order !== 0) {
                    return (
                      <tr
                        key={
                          "block_" +
                          blocks?.[index]?.name +
                          blocks?.[index]?.id +
                          index
                        }
                      >
                        <td>{blocks?.[index]?.order}</td>
                        <td>
                          {blocks?.[index]?.name &&
                            capitalizeFirst(blocks?.[index]?.name)}
                        </td>

                        <td>
                          {blocks?.[index]?.type &&
                            capitalizeFirst(blocks?.[index]?.type)}
                        </td>
                        <td>
                          <div className="flex h-full flex-row items-center justify-center gap-3">
                            <button
                              type="button"
                              className="btn-primary btn-md"
                              onClick={() => {
                                setSelectedItems(blocks[index].content);
                                setEditingContent(true);
                                setEditingIndex(index);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              name="_action"
                              value="delete"
                              className="btn-primary btn-md"
                              onClick={() => {
                                const formData = new FormData();

                                formData.set("_action", "delete");
                                formData.set(
                                  "pageId",
                                  page.id.toString() || ""
                                );
                                formData.set(
                                  "itemIndex",
                                  index.toString() || ""
                                );

                                submit(formData, {
                                  method: "POST",
                                });

                                setEditingContent(false);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  } else return null;
                })}
            </tbody>
          </table>
          <button
            type="button"
            className="btn-primary btn-md mx-auto mt-3 block"
            onClick={() => {
              setEditingIndex(blocks.length);
              setEditingContent(true);
            }}
          >
            Add
          </button>
        </div>
      )}

      {editingContent && (
        <div className="max-w-screen my-3 flex w-[720px] flex-col gap-6">
          <Form
            method="POST"
            ref={searchFormRef}
            className="flex w-full flex-row flex-wrap justify-start gap-3"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Block</span>
              </label>
              <select
                name="blockName"
                className="select-bordered select w-[95vw] sm:w-[215px]"
                defaultValue="Select Block"
                placeholder="Select Block"
                onChange={handleSearchSubmit}
              >
                <option value="">Select Block</option>
                <option value="banner">Banner</option>
                <option value="tile">Tile</option>
                <option value="products">Products</option>
              </select>
            </div>

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
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Search Content</span>
                </label>
                <SearchInput name="name" placeholder="Name" />
              </div>
            </div>
          </Form>

          {searchResults && (
            <div className="max-w-3xl overflow-x-auto">
              <div className="divider my-0 w-full py-0" />
              <p className="mt-3 text-xs">Select an Item</p>
              <table className="table-sm table">
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
                          onClick={() => {
                            selectItem(searchResults[index]);
                          }}
                        >
                          <td className="w-1/4">{index + 1}</td>
                          <td className="w-1/4">{name}</td>
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

          {selectedItems.length === 0 && (
            <button
              type="button"
              className="btn-primary btn-md w-max"
              onClick={() => {
                setEditingContent(false);
                setSelectedItems([]);
              }}
            >
              Back
            </button>
          )}

          {selectedItems && selectedItems.length > 0 && (
            <div className="max-w-3xl overflow-x-auto">
              <div className="divider my-0 w-full py-0" />
              <p className="mt-3 text-xs">Selected Items</p>
              <table className="table-sm table">
                <thead>
                  <tr>
                    <th className="w-1/4"></th>
                    <th className="w-1/4">Name</th>
                    <th className="w-1/4">Created</th>
                    <th className="w-1/4">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems?.map(
                    ({ name, createdAt }: Promotion | Campaign, index) => {
                      return (
                        <tr
                          key={"promotionOrCampaign_" + name + index}
                          className="hover cursor-pointer"
                        >
                          <td className="w-1/4">{index + 1}</td>
                          <td className="w-1/4">{name}</td>
                          <td className="w-1/4">
                            {new Date(createdAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>
                          <td className="w-1/4">
                            <div
                              className="ml-2"
                              onClick={() =>
                                setSelectedItems((products) =>
                                  products.filter((_, index) => index !== 0)
                                )
                              }
                            >
                              <IoCaretForwardCircleSharp />
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>

              <div className="mt-12 flex flex-row justify-center gap-3">
                <button
                  type="button"
                  className="btn-primary btn-md"
                  onClick={() => {
                    setEditingContent(false);
                    setSelectedItems([]);
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
        </div>
      )}
    </>
  );
};

export default ContentBuilder;

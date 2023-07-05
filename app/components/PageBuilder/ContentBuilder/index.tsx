import { useState } from "react";
import { capitalizeFirst } from "~/utility/stringHelpers";
import { IoCaretForwardCircleSharp } from "react-icons/io5";
import {
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import SearchInput from "~/components/Forms/Input/SearchInput";
import {
  getBlockContentType,
  getBlockName,
  getPageData,
} from "~/utility/blockHelpers";

type Props = {
  page: Page;
  searchResults: Campaign[] | Promotion[];
};

const ContentBuilder = ({ page, searchResults }: Props) => {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { pageItems } = page || {};
  const [editingContent, setEditingContent] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<(Campaign | Promotion)[]>(
    []
  );

  const { blocks, content } = getPageData(page);

  const selectItem = (item: Campaign | Promotion) => {
    const blockType = searchParams.get("blockType");

    if (blockType === "banner" && selectedItems.length >= 1) {
      // BANNER BLOCK CAN ONLY HAVE 1 ITEM
      return;
    }

    if (blockType === "tile" && selectedItems.length >= 4) {
      // TILE BLOCK CAN HAVE MAX OF 4 ITEMS
      return;
    }

    setSelectedItems((prevSelectedItems: (Campaign | Promotion)[]) => [
      ...prevSelectedItems,
      item,
    ]);
  };

  return (
    <>
      {!editingContent && (
        <div className="w-[600px] overflow-x-auto">
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
              {pageItems
                ?.sort((a: PageItem, b: PageItem) => a.order - b.order)
                .map((e: PageItem, index) => {
                  const type = getBlockContentType(e);
                  const name = getBlockName(e);

                  if (index !== 0 && e.order !== 0) {
                    return (
                      <tr
                        key={
                          "pageItem_" +
                          blocks?.[index]?.name +
                          blocks?.[index]?.id +
                          index
                        }
                      >
                        <td>{e?.order}</td>
                        <td>{name && capitalizeFirst(name)}</td>

                        <td>{type}</td>
                        <td>
                          <div className="flex h-full flex-row items-center justify-center gap-3">
                            <button
                              type="button"
                              className="btn-primary btn-md"
                              onClick={() => {
                                setSelectedItems(content[index]);
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
              setEditingIndex(pageItems.length);
              setEditingContent(true);
            }}
          >
            Add
          </button>
        </div>
      )}

      {editingContent && (
        <>
          <div className="my-3 flex flex-col gap-3">
            <div className="flex w-max flex-row gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Block Type</span>
                </label>
                <select
                  name="banner"
                  className="select-bordered select w-[95vw] sm:w-[215px]"
                  defaultValue="Select Block Type"
                  placeholder="Select a Type"
                  onChange={(e) => {
                    searchParams.set("blockType", e.target.value);
                    submit(searchParams, {
                      method: "GET",
                    });
                  }}
                >
                  <option value="">Select Block Type</option>
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
                  name="banner"
                  className="select-bordered select w-[95vw] sm:w-[215px]"
                  defaultValue="Select Content Type"
                  placeholder="Select a Type"
                  onChange={(e) => {
                    searchParams.set("contentType", e.target.value);
                    submit(searchParams, {
                      method: "GET",
                    });
                  }}
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
            </div>

            {selectedItems && selectedItems.length > 0 && (
              <>
                <p className="mt-3 text-xs">Selected Items</p>

                <div className="max-w-3xl overflow-x-auto">
                  <table className="table-xs table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Created</th>
                        <th>Delete</th>
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
                              <th>{index + 1}</th>
                              <td>{name}</td>
                              <td>
                                {new Date(createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                              <td>
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
                </div>
              </>
            )}

            <p className="mt-3 text-xs">Select an Item</p>

            <div className="max-w-3xl overflow-x-auto">
              <table className="table-xs table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Created</th>
                    <th>Go To</th>
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
                          <th>{index + 1}</th>
                          <td>{name}</td>
                          <td>
                            {new Date(createdAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>
                          <td>
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
              <div className="mt-6 flex flex-row justify-center gap-3">
                <button
                  type="button"
                  className="btn-primary btn-md"
                  onClick={() => {
                    setEditingContent(false);
                    navigate(pathname);
                  }}
                >
                  Back
                </button>

                <button
                  type="button"
                  className="btn-primary btn-md"
                  onClick={() => {
                    const formData = new FormData();
                    const blockType = searchParams.get("blockType");

                    formData.set("_action", "updateBanner");
                    formData.set("pageId", page.id.toString() || "");
                    formData.set("itemIndex", editingIndex.toString());
                    formData.set("blockType", blockType as string);
                    formData.set(
                      "contentType",
                      searchParams.get("contentType") as string
                    );
                    formData.set(
                      "contentData",
                      JSON.stringify(selectedItems) as string
                    );

                    submit(formData, {
                      method: "POST",
                    });

                    setEditingContent(false);
                    setSelectedItems([]);
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ContentBuilder;

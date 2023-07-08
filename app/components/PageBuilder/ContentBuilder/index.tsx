import { useRef, useState } from "react";
import { capitalizeFirst } from "~/utility/stringHelpers";
import { IoCaretForwardCircleSharp, IoCloseCircle } from "react-icons/io5";
import { Form, useSearchParams, useSubmit } from "@remix-run/react";
import SearchInput from "~/components/Forms/Input/SearchInput";
import { getBlocks } from "~/utility/blockHelpers";
import BlockIcon from "~/components/Blocks/BlockIcon";
import RichTextEditor from "~/components/RichTextEditor.client";
import SelectBrand from "~/components/Forms/Select/SelectBrand";
import SelectRootCategory from "~/components/Forms/Select/SelectRootCategory";
import ProductCategories from "~/routes/admin_.product-categories";
import SelectProductCategory from "~/components/Forms/Select/SelectProductCategory";

type Props = {
  page: HomePage | Article;
  searchResults: Campaign[] | Promotion[];
  rootCategories: RootCategory[];
  productCategories: ProductCategory[];
  brands: Brand[];
};

const ContentBuilder = ({
  page,
  searchResults,
  rootCategories,
  productCategories,
  brands,
}: Props) => {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const searchFormRef = useRef<HTMLFormElement>(null);
  const [selectedBlock, setSelectedBlock] = useState<BlockName | undefined>();
  const [editingContent, setEditingContent] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<(Campaign | Promotion)[]>(
    []
  );
  const [stringData, setStringData] = useState<string>();

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
      if (page) {
        updateForm.set("pageId", page.id.toString() || "");
      }
      if (contentType) {
        updateForm.set("contentType", contentType as string);
      }
      if (selectedItems) {
        updateForm.set("contentData", JSON.stringify(selectedItems) as string);
      }
      if (stringData) {
        updateForm.set("stringData", stringData as string);
      }
      updateForm.set("itemIndex", editingIndex.toString());
      updateForm.set("blockName", blockName as string);

      submit(updateForm, {
        method: "POST",
      });

      setEditingContent(false);
      setSelectedItems([]);
    }
  };

  const reset = () => {
    setStringData(undefined);
    setEditingContent(false);
    setSelectedBlock(undefined);
    setSelectedItems([]);
  };

  return (
    <>
      {!editingContent && (
        <div className="flex w-full max-w-full flex-col items-center overflow-x-hidden">
          <div className="divider w-full" />
          <div className="scrollbar-hide w-full overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-1/4">#</th>
                  <th className="w-1/4">Block</th>
                  <th className="w-1/4">Type</th>
                  <th className="w-1/4"></th>
                </tr>
              </thead>
              <tbody>
                {blocks
                  ?.sort((a: Block, b: Block) => a.order - b.order)
                  .map((e: Block, index) => {
                    return (
                      <tr
                        key={
                          "block_" +
                          blocks?.[index]?.name +
                          blocks?.[index]?.id +
                          index
                        }
                      >
                        <td>{blocks?.[index]?.order + 1}</td>
                        <td>
                          <div className="flex gap-3">
                            <BlockIcon
                              blockName={blocks[index].name}
                              size={18}
                              styles={"mt-[1px]"}
                            />

                            <p>{capitalizeFirst(blocks[index].name)}</p>
                          </div>
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
                                console.log(blocks[0].content[0]);
                                if (blocks[index].name === "banner" || "tile") {
                                  setSelectedBlock(
                                    (blocks[index].name as "banner") || "tile"
                                  );
                                  setSelectedItems(
                                    blocks[index].content as
                                      | Campaign[]
                                      | Promotion[]
                                  );
                                }
                                if (blocks[index].name === "text") {
                                  setSelectedBlock("text");
                                  setStringData(
                                    blocks[index].content[0] as string
                                  );
                                  setSelectedItems([]);
                                }
                                setEditingContent(true);
                                setEditingIndex(index);
                              }}
                            >
                              Edit
                            </button>

                            <button
                              disabled={index === 0}
                              type="button"
                              name="_action"
                              value="delete"
                              className={`btn-primary btn-md ${
                                index === 0 && "grayscale"
                              }`}
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
                  })}
              </tbody>
            </table>
          </div>
          <div className="divider w-full" />

          <button
            type="button"
            className="btn-primary btn-md"
            onClick={() => {
              setEditingIndex(blocks.length);
              setEditingContent(true);
            }}
          >
            Add Block +
          </button>
        </div>
      )}

      {editingContent && (
        <div className="my-3 flex w-full flex-col gap-6">
          <Form
            method="POST"
            ref={searchFormRef}
            className="flex w-full flex-row flex-wrap justify-center sm:justify-start"
          >
            <div className="flex w-full flex-wrap gap-3 bg-base-300 px-2 py-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Block</span>
                </label>
                <select
                  name="blockName"
                  className="select-bordered select w-[95vw] max-w-full sm:w-[215px]"
                  defaultValue={selectedBlock}
                  placeholder="Select Block"
                  onChange={(e) => {
                    setSelectedBlock(e.target.value as BlockName);
                    setSelectedItems([]);
                  }}
                >
                  <option value="">Select Block</option>
                  <option value="banner">Banner</option>
                  <option value="tile">Tile</option>
                  <option value="text">Text</option>
                  <option value="product">Product</option>
                </select>
              </div>

              {(selectedBlock === "banner" || selectedBlock === "tile") && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Content Type</span>
                  </label>
                  <select
                    name="contentType"
                    className="select-bordered select w-[95vw] max-w-full sm:w-[215px]"
                    defaultValue="Select Content Type"
                    placeholder="Select a Type"
                    onChange={handleSearchSubmit}
                  >
                    <option value="">Select Content Type</option>
                    <option value="promotion">Promotion</option>
                    <option value="campaign">Campaign</option>
                  </select>
                </div>
              )}

              {(selectedBlock === "banner" || selectedBlock === "tile") && (
                <div className="flex flex-row gap-6">
                  <div className="form-control w-[95vw] sm:w-[215px]">
                    <label className="label">
                      <span className="label-text">Search Content</span>
                    </label>
                    <SearchInput name="name" placeholder="Name" />
                  </div>
                </div>
              )}
            </div>

            {selectedBlock === "product" && (
              <div className=" w-full bg-base-300 px-2 py-3">
                <p className="px-1 pb-3 font-bold">Product Block Filters</p>
                <div className="flex flex-wrap gap-3">
                  <SelectRootCategory rootCategories={rootCategories} />

                  <SelectProductCategory
                    productCategories={productCategories}
                  />

                  <SelectBrand brands={brands} />
                </div>
              </div>
            )}
          </Form>

          {/* BLOCK OPTIONS */}
          <div className=" w-full bg-base-300 px-2 py-3">
            <p className="px-1 pb-3 font-bold">Options</p>
            <div className="flex flex-wrap gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sort By</span>
                </label>
                <select
                  className="select-bordered select w-[95vw] max-w-full sm:w-[215px]"
                  placeholder="Select a Type"
                >
                  <option value="">Select Order</option>
                  <option value="name">Name</option>
                  <option value="createdAt">Created</option>
                  <option value="totalSold">Popularity</option>
                  <option value="price">Price</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sort Order</span>
                </label>
                <select
                  className="select-bordered select w-[95vw] max-w-full sm:w-[215px]"
                  placeholder="Select a Type"
                >
                  <option value="">Select Order</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Size</span>
                </label>
                <select
                  className="select-bordered select w-[95vw] max-w-full sm:w-[215px]"
                  placeholder="Select a Type"
                >
                  <option value="">Select Size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Count</span>
                </label>
                <input
                  type="number"
                  className="input-bordered input w-[95vw] max-w-full sm:w-[215px]"
                  placeholder="Count"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Rows</span>
                </label>
                <input
                  type="number"
                  className="input-bordered input w-[95vw] max-w-full sm:w-[215px]"
                  placeholder="Rows"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Columns</span>
                </label>
                <input
                  type="number"
                  className="input-bordered input w-[95vw] max-w-full sm:w-[215px]"
                  placeholder="Columns"
                />
              </div>
            </div>
          </div>

          {selectedBlock === "text" && (
            <div className="w-full overflow-x-auto">
              <div className="divider my-0 w-full py-0" />
              <RichTextEditor
                value={stringData}
                onChange={setStringData}
                className="mb-12 mt-6 h-[320px]"
              />
            </div>
          )}

          {searchResults &&
            (selectedBlock === "banner" || selectedBlock === "tile") && (
              <div className="w-full overflow-x-auto">
                <div className="divider my-0 w-full py-0" />
                <p className="my-3 text-sm font-bold">Select an Item</p>
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
                                <IoCaretForwardCircleSharp size={18} />
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

          {selectedItems && selectedItems.length > 0 && (
            <div className="max-w-3xl overflow-x-auto">
              <div className="divider my-0 w-full py-0" />
              <p className="my-3 text-sm font-bold">Selected Items</p>
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
                              <IoCloseCircle size={18} />
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>

              <div className="divider w-full" />
            </div>
          )}
          <div className="flex flex-row justify-center gap-3">
            <button
              type="button"
              className="btn-primary btn-md"
              onClick={reset}
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

export default ContentBuilder;

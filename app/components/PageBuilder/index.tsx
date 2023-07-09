import { useEffect, useState } from "react";
import { capitalizeFirst } from "~/utility/stringHelpers";
import { Form, useSubmit } from "@remix-run/react";
import { getBlocks } from "~/utility/blockHelpers";
import BlockIcon from "~/components/Blocks/BlockIcon";
import BlockOptions from "./BlockOptions";
import ProductBlockOptions from "./ProductBlockOptions";
import TextBlockOptions from "./TextBlockOptions";
import BlockContentSearch from "./BlockContentSearch";
import BlockContentResults from "./BlockContentResults";

type Props = {
  page: HomePage | Article;
  searchResults: Campaign[] | Promotion[];
  updateSuccess: boolean;
  rootCategories: RootCategory[];
  productCategories: ProductCategory[];
  brands: Brand[];
};

const PageBuilder = ({
  page,
  searchResults,
  updateSuccess,
  rootCategories,
  productCategories,
  brands,
}: Props) => {
  const submit = useSubmit();

  const blocks = getBlocks(page);

  const [selectedBlock, setSelectedBlock] = useState<BlockName | undefined>();
  const [editingContent, setEditingContent] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<(Campaign | Promotion)[]>(
    []
  );

  const reset = () => {
    setEditingContent(false);
    setSelectedBlock(undefined);
    setSelectedItems([]);
  };

  useEffect(() => {
    if (updateSuccess) {
      reset();
    }
  }, [updateSuccess]);

  return (
    <Form className="max-w-screen w-full" method="POST">
      <input name="pageId" value={page.id} hidden readOnly />
      <input name="itemIndex" value={editingIndex.toString()} hidden readOnly />

      <div className="divider w-full" />
      {!editingContent && (
        <div className="flex w-full max-w-full flex-col items-center overflow-x-hidden">
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
        <div className="mt-3 flex w-full flex-col gap-6">
          <div className="flex w-full flex-row flex-wrap justify-center gap-3 sm:justify-start">
            <div className="w-full bg-base-300 px-2 py-3">
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
            </div>
          </div>

          <BlockOptions selectedBlock={selectedBlock} />

          <BlockContentSearch selectedBlock={selectedBlock} />

          <ProductBlockOptions
            selectedBlock={selectedBlock}
            rootCategories={rootCategories}
            productCategories={productCategories}
            brands={brands}
          />

          <TextBlockOptions
            selectedBlock={selectedBlock}
            defaultValue={blocks[editingIndex]?.content[0] as string}
          />

          <BlockContentResults
            selectedBlock={selectedBlock}
            searchResults={searchResults}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />

          <div className="flex flex-row justify-center gap-3">
            <button
              type="button"
              className="btn-primary btn-md"
              onClick={reset}
            >
              Back
            </button>

            <button
              type="submit"
              name="_action"
              value="update"
              className="btn-primary btn-md"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </Form>
  );
};

export default PageBuilder;

export const parseContentData = (contentData: FormDataEntryValue) => {
  let contentDataParsed;

  if (contentData) {
    contentDataParsed = JSON.parse(contentData as string) as
      | Campaign[]
      | Promotion[];

    contentDataParsed = Array.isArray(contentDataParsed)
      ? contentDataParsed
      : [contentDataParsed];

    return contentDataParsed;
  }
};

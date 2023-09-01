import { useEffect, useState } from "react";
import { capitalizeFirst } from "~/utility/stringHelpers";
import { Form, useSubmit } from "@remix-run/react";
import { getBlocks } from "~/utility/blockHelpers";
import BlockIcon from "~/components/Blocks/BlockIcon";
import BlockOptions from "./BlockOptions";
import ProductBlockOptions from "./ProductBlockOptions";
import TextBlockOptions from "./TextBlockOptions";
import BlockContentSearch from "./BlockContentSearch";
import BlockContentResultsTable from "./BlockContentResultsTable";
import {
  HiMiniArrowDown,
  HiMiniArrowUp,
  HiPencil,
  HiTrash,
} from "react-icons/hi2";
import ArticleBlockOptions from "./ArticleBlockOptions";
import BlockContentImageResults from "./BlockContentImageResults";

type Props = {
  page: HomePage | Article;
  searchResults: Campaign[] | Promotion[] | Image[] | undefined;
  updateSuccess: boolean;
  productCategories: ProductCategory[];
  productSubCategories: ProductSubCategory[];
  brands: Brand[];
  articleCategories: ArticleCategory[];
};

const PageBuilder = ({
  page,
  searchResults,
  updateSuccess,
  productCategories,
  productSubCategories,
  brands,
  articleCategories,
}: Props) => {
  const submit = useSubmit();

  const blocks = getBlocks(page);

  const [selectedBlock, setSelectedBlock] = useState<BlockName | undefined>();
  const [contentType, setContentType] = useState<BlockContentType>();
  const [editingContent, setEditingContent] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<
    (Campaign | Promotion | ContentImage)[]
  >(blocks[editingIndex]?.content as Campaign[] | Promotion[]);

  const reset = () => {
    setEditingContent(false);
    setSelectedBlock(undefined);
    setSelectedItems([]);
  };

  const editBlock = (i: number) => {
    setEditingContent(true);
    setEditingIndex(i);

    if (blocks[i].name === "banner" || "tile") {
      setSelectedBlock((blocks[i].name as "banner") || "tile");
      setSelectedItems(blocks[i].content as Campaign[] | Promotion[]);
    }
    if (blocks[i].name === "text") {
      setSelectedBlock("text");
      setSelectedItems([]);
    }
  };

  const deleteBlock = (i: number) => {
    const formData = new FormData();

    formData.set("_action", "delete");
    formData.set("pageId", page.id.toString() || "");
    formData.set("itemIndex", i.toString() || "");

    submit(formData, {
      method: "POST",
    });

    setEditingContent(false);
  };

  const changeBlockOrder = (i: number, direction: "up" | "down") => {
    const formData = new FormData();
    formData.set("_action", "rearrange");
    formData.set("pageId", page.id.toString() || "");
    formData.set("itemIndex", i.toString() || "");
    formData.set("direction", direction.toString() || "");

    submit(formData, {
      method: "POST",
    });
  };

  useEffect(() => {
    if (updateSuccess) {
      reset();
    }
    setLoading(false);
  }, [updateSuccess]);

  useEffect(() => {
    setSelectedItems([]);
  }, [contentType]);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Form className="w-full" method="POST">
      <input name="pageId" value={page.id} hidden readOnly />
      <input name="itemIndex" value={editingIndex.toString()} hidden readOnly />
      {!editingContent && (
        <div className="flex w-full max-w-full flex-col items-center overflow-x-hidden">
          <div className="scrollbar-hide w-full overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="border-b-0 text-brand-white/50">
                  <th className="w-1/4">#</th>
                  <th className="w-1/4">Block</th>
                  <th className="w-1/4">Type</th>
                  <th className="w-1/4"></th>
                </tr>
              </thead>
              <tbody>
                {blocks
                  ?.sort((a: Block, b: Block) => a.order - b.order)
                  .map((e: Block, i) => {
                    return (
                      <tr
                        className="border-b-0"
                        key={"block_" + blocks?.[i]?.name + blocks?.[i]?.id + i}
                      >
                        <td>{blocks?.[i]?.order + 1}</td>
                        <td>
                          <div className="flex gap-3">
                            <BlockIcon
                              blockName={blocks[i].name}
                              size={18}
                              styles={"mt-[1px]"}
                            />

                            <p>{capitalizeFirst(blocks[i]?.name)}</p>
                          </div>
                        </td>

                        <td>
                          {blocks?.[i]?.type &&
                            capitalizeFirst(blocks?.[i]?.type)}
                        </td>
                        <td>
                          <div className="flex h-full flex-row items-center justify-center gap-3">
                            <HiMiniArrowDown
                              size={24}
                              className="cursor-pointer rounded-full bg-primary p-[0.3rem] text-primary-content"
                              onClick={() => changeBlockOrder(i, "down")}
                            />

                            <HiMiniArrowUp
                              size={24}
                              className="cursor-pointer rounded-full bg-primary p-[0.3rem] text-primary-content"
                              onClick={() => changeBlockOrder(i, "up")}
                            />

                            <HiPencil
                              size={24}
                              className="cursor-pointer rounded-full bg-primary p-[0.3rem] text-primary-content"
                              onClick={() => {
                                editBlock(i);
                              }}
                            />
                            {i > 0 && (
                              <HiTrash
                                size={24}
                                className="cursor-pointer rounded-full bg-error p-[0.3rem] text-primary-content"
                                onClick={() => {
                                  deleteBlock(i);
                                }}
                              />
                            )}
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
            <div className="w-full pb-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text pt-1 font-semibold text-brand-white">
                    Block
                  </span>
                </label>
                <select
                  name="blockName"
                  className=" select w-[95vw] max-w-full text-brand-black/75 sm:w-[215px]"
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
                  <option value="article">Articles</option>
                </select>
              </div>
            </div>
          </div>

          <BlockOptions
            selectedBlock={selectedBlock}
            defaultValues={blocks[editingIndex]?.blockOptions}
          />

          <BlockContentSearch
            selectedBlock={selectedBlock}
            defaultValue={blocks[editingIndex]?.type as BlockContentType}
            contentType={contentType}
            setContentType={setContentType}
          />

          <ProductBlockOptions
            selectedBlock={selectedBlock}
            productCategories={productCategories}
            productSubCategories={productSubCategories}
            brands={brands}
            defaultValues={
              blocks[editingIndex]?.content[0] as ProductBlockContent
            }
          />

          <ArticleBlockOptions
            selectedBlock={selectedBlock}
            articleCategories={articleCategories}
            defaultValues={
              blocks[editingIndex]?.content[0] as ProductBlockContent
            }
          />

          <TextBlockOptions
            selectedBlock={selectedBlock}
            defaultValue={blocks[editingIndex]?.content as string[]}
          />

          {(contentType === "campaign" || contentType === "promotion") && (
            <BlockContentResultsTable
              selectedBlock={selectedBlock}
              searchResults={searchResults as Campaign[] | Promotion[]}
              selectedItems={selectedItems as (Campaign | Promotion)[]}
              setSelectedItems={setSelectedItems}
            />
          )}

          {contentType === "image" && (
            <BlockContentImageResults
              selectedBlock={selectedBlock}
              searchResults={searchResults as Image[]}
              selectedItems={selectedItems as ContentImage[]}
              setSelectedItems={setSelectedItems}
            />
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
              type="submit"
              name="_action"
              value="update"
              className="btn-primary btn-md"
              onClick={() => setLoading(true)}
            >
              {loading ? "Loading..." : "Submit"}
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

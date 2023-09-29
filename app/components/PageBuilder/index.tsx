import { useEffect, useState } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { blockMaster } from "~/utility/blockMaster";
import BlockIcon from "~/components/Blocks/BlockIcon";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import { getBlockDefaultValues } from "~/helpers/blockHelpers";
import {
  HiMiniArrowDown,
  HiMiniArrowUp,
  HiPencil,
  HiTrash,
} from "react-icons/hi2";
import BlockOptions from "./BlockOptions";
import SelectedContent from "./SelectedContent";
import TextBlockOptions from "./TextBlockOptions";
import BlockContentSearch from "./BlockContentSearch";
import ProductBlockOptions from "./ProductBlockOptions";
import ArticleBlockOptions from "./ArticleBlockOptions";
import BlockContentResultsTable from "./BlockContentResultsTable";
import BlockContentImageResults from "./BlockContentImageResults";
import BackSubmitButtons from "../Forms/Buttons/BackSubmitButtons";

type Props = {
  page: HomePage | Article;
  blocks: Block[];
  searchResults: Campaign[] | Promotion[] | Image[] | undefined;
  updateSuccess: boolean;
  productCategories: ProductCategory[];
  productSubCategories: ProductSubCategory[];
  brands: Brand[];
  articleCategories: ArticleCategory[];
  colors: string[];
};

const PageBuilder = ({
  page,
  blocks,
  searchResults,
  updateSuccess,
  productCategories,
  productSubCategories,
  brands,
  articleCategories,
  colors,
}: Props) => {
  const submit = useSubmit();

  const [selectedBlock, setSelectedBlock] = useState<BlockName | undefined>();
  const [contentType, setContentType] = useState<BlockContentType>();
  const [editingContent, setEditingContent] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<ContentSelection[]>([]);

  const handleItemSelect = (items: ContentSelection[]) => {
    //check to see if we are at the content limit for the block before adding content
    const selectedBlocksContentLimit = blockMaster.find(
      (e) => selectedBlock === e.name
    )?.maxContentItems;

    if (
      (selectedBlocksContentLimit &&
        selectedItems.length >= selectedBlocksContentLimit) ||
      (!selectedBlocksContentLimit && selectedItems.length === 1)
    ) {
      return;
    }

    setSelectedItems(items);
  };

  const reset = () => {
    setEditingContent(false);
    setSelectedBlock(undefined);
  };

  const editBlock = (i: number) => {
    setEditingContent(true);
    setEditingIndex(i);
    setSelectedItems(getBlockDefaultValues(blocks[i]));
    setSelectedBlock(blocks[i].name);
  };

  const deleteBlock = (blockId: string, blockName: string) => {
    const formData = new FormData();

    formData.set("_action", "delete");
    formData.set("blockId", blockId.toString() || "");
    formData.set("blockName", blockName.toString() || "");

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

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Form className="w-full" method="POST">
      <input name="pageId" value={page.id} hidden readOnly />
      <input name="itemIndex" value={editingIndex.toString()} hidden readOnly />
      {!editingContent && (
        <div className="flex w-full max-w-full flex-col items-center gap-3 overflow-x-hidden">
          <div className="scrollbar-hide">
            {blocks
              ?.sort((a: Block, b: Block) => a.order - b.order)
              .map(({ id, name }: Block, i) => {
                return (
                  <div
                    key={"block_" + i}
                    className="max-w-screen my-3 flex w-[400px] cursor-pointer justify-between rounded-sm border border-brand-white/50 px-3 py-3 transition duration-300 ease-in-out hover:scale-[1.01] max-md:w-[360px]"
                  >
                    <div
                      className="flex items-center gap-3"
                      onClick={() => {
                        editBlock(i);
                      }}
                    >
                      {/* NUMBER */}
                      <div className="text-xs"># {blocks[i]?.order + 1}</div>
                      {/* ICON */}
                      <div className="flex gap-3">
                        <BlockIcon
                          blockName={blocks[i].name}
                          size={18}
                          styles={"mt-[3px]"}
                        />
                        <p className="font-bold">
                          {capitalizeFirst(blocks[i]?.name)}
                        </p>
                      </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex h-full flex-row items-center justify-start gap-3">
                      {i < blocks.length - 1 && (
                        <HiMiniArrowDown
                          size={28}
                          className="cursor-pointer rounded-md bg-primary p-[0.3rem] text-primary-content hover:bg-primary-focus"
                          onClick={() => changeBlockOrder(i, "down")}
                        />
                      )}

                      {i > 0 && (
                        <HiMiniArrowUp
                          size={28}
                          className="cursor-pointer rounded-md bg-primary p-[0.3rem] text-primary-content hover:bg-primary-focus"
                          onClick={() => changeBlockOrder(i, "up")}
                        />
                      )}

                      <HiPencil
                        size={28}
                        className="cursor-pointer rounded-md bg-primary p-[0.3rem] text-primary-content hover:bg-primary-focus"
                        onClick={() => {
                          editBlock(i);
                        }}
                      />
                      {i > 0 && (
                        <HiTrash
                          size={28}
                          className="cursor-pointer rounded-md bg-error p-[0.3rem] text-primary-content hover:bg-red-500"
                          onClick={() => {
                            deleteBlock(id, name);
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <button
            type="button"
            className="btn-primary btn-md rounded-sm"
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
        <div className="mt-3 flex w-full flex-col gap-6 px-3 max-md:px-0">
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
                  }}
                >
                  <option value="">Select Block</option>

                  {blockMaster.map(({ name }: BlockMaster) => {
                    return (
                      <option key={"blockSelect_" + name} value={name}>
                        {capitalizeFirst(name)}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          <BlockOptions
            selectedBlock={selectedBlock}
            defaultValues={blocks[editingIndex]?.blockOptions[0]}
            contentType={contentType}
            colors={colors}
          />

          <BlockContentSearch
            selectedBlock={selectedBlock}
            defaultValue={blocks[editingIndex]?.type as BlockContentType}
            setContentType={setContentType}
          />

          <ProductBlockOptions
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={handleItemSelect}
            productCategories={productCategories}
            productSubCategories={productSubCategories}
            brands={brands}
            defaultValues={blocks[editingIndex]?.content as ProductBlockContent}
          />

          <ArticleBlockOptions
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={handleItemSelect}
            articleCategories={articleCategories}
            defaultValues={blocks[editingIndex]?.content as ArticleBlockContent}
          />

          <TextBlockOptions
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            defaultValue={blocks[editingIndex]?.content as TextBlockContent}
          />

          <BlockContentResultsTable
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={handleItemSelect}
            searchResults={searchResults as Campaign[] | Promotion[]}
            contentType={contentType}
          />

          <BlockContentImageResults
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={handleItemSelect}
            searchResults={searchResults as Image[]}
            contentType={contentType}
          />

          <SelectedContent
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
          {selectedItems && (
            <input
              name="contentSelection"
              value={JSON.stringify(selectedItems)}
              hidden
              readOnly
            />
          )}

          <BackSubmitButtons
            value="update"
            divider={false}
            loading={loading}
            setLoading={setLoading}
            backFunction={reset}
            requiredValueToSubmit={selectedItems && selectedItems.length > 0}
            validationMessage="Content is Required."
          />
        </div>
      )}
    </Form>
  );
};

export default PageBuilder;

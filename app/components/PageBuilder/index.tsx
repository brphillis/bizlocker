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
  previewPage: PreviewPage;
  pageType: PageType;
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
  previewPage,
  pageType,
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

  const handleLimitedItemSelect = (items: ContentSelection[]) => {
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

  const blockRequiresContent = (blockName: BlockName): boolean => {
    const block = blockMaster.find((e) => blockName === e.name);
    if (block?.contentRequired) {
      return true;
    } else return false;
  };

  const reset = () => {
    setEditingContent(false);
    setSelectedBlock(undefined);
    setSelectedItems([]);
  };

  const editBlock = (i: number) => {
    setEditingContent(true);
    setEditingIndex(i);
    setSelectedItems(getBlockDefaultValues(blocks[i]));
    setSelectedBlock(blocks[i].name);
  };

  const disconnectBlock = (blockId: string, blockName: BlockName) => {
    const formData = new FormData();

    formData.set("_action", "delete");
    formData.set("blockName", blockName.toString() || "");
    formData.set("blockId", blockId.toString() || "");
    formData.set("previewPageId", previewPage.id.toString() || "");

    submit(formData, {
      method: "POST",
    });

    setEditingContent(false);
  };

  const changeBlockOrder = (index: number, direction: "up" | "down") => {
    const pageBlockIds = JSON.stringify(previewPage.blocks.map((e) => e.id));

    const formData = new FormData();
    formData.set("_action", "rearrange");
    formData.set("previewPageId", previewPage.id.toString() || "");
    formData.set("pageBlocks", pageBlockIds || "");
    formData.set("index", index.toString() || "");
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
    <Form className="relative w-full" method="POST">
      <input name="pageId" value={previewPage.id} hidden readOnly />
      <input name="itemIndex" value={editingIndex.toString()} hidden readOnly />
      {!editingContent && (
        <div className="flex w-full max-w-full flex-col items-center gap-3 overflow-x-hidden">
          <div className="scrollbar-hide">
            {blocks.map(({ id, name }: Block, i) => {
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
                          disconnectBlock(id, name);
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
        <div className="relative mt-3 flex w-full flex-col gap-6 px-3 max-md:px-0">
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
            selectedItems={selectedItems}
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
            setSelectedItems={setSelectedItems}
            productCategories={productCategories}
            productSubCategories={productSubCategories}
            brands={brands}
            defaultValues={blocks[editingIndex]?.content as ProductBlockContent}
          />

          <ArticleBlockOptions
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
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
            setSelectedItems={handleLimitedItemSelect}
            searchResults={searchResults as Campaign[] | Promotion[]}
            contentType={contentType}
          />

          <BlockContentImageResults
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={handleLimitedItemSelect}
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
            requiredValueToSubmit={
              selectedBlock && blockRequiresContent(selectedBlock)
                ? selectedItems && selectedItems.length > 0
                : true
            }
            validationMessage="Content is Required."
          />
        </div>
      )}
    </Form>
  );
};

export default PageBuilder;

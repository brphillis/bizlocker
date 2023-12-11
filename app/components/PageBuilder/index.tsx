import { useEffect, useState } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { type BlockName, blockMaster } from "~/utility/blockMaster";
import BlockIcon from "~/components/Blocks/BlockIcon";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import { getBlockDefaultValues } from "~/helpers/blockHelpers";
import type {
  ArticleCategory,
  Brand,
  Campaign,
  Image,
  ProductCategory,
  ProductSubCategory,
  Promotion,
} from "@prisma/client";
import type { BlockContent } from "~/models/blocks.server";
import type { Page, PageBlock } from "~/models/pageBuilder.server";
import BlockSelect from "./BlockSelect";
import ResultsTable from "./Content/ResultsTable";
import ContentSearch from "./Content/ContentSearch";
import ResultsImages from "./Content/ResultsImages";
import SelectedContent from "./Content/SelectedContent";
import SquareIconButton from "../Buttons/SquareIconButton";
import ProductBlockOptions from "./Options/ProductBlockOptions";
import ArticleBlockOptions from "./Options/ArticleBlockOptions";
import BackSubmitButtons from "../Forms/Buttons/BackSubmitButtons";
import BlockOptionsModule from "./BlockOptions";
import TextBlockContentModule from "./Content/TextBlockContent";

type Props = {
  previewPage: Page;
  blocks: PageBlock[] | null;
  searchResults: Campaign[] | Promotion[] | Image[] | undefined;
  updateSuccess: boolean;
  productCategories: ProductCategory[];
  productSubCategories: ProductSubCategory[];
  brands: Brand[] | null;
  articleCategories: ArticleCategory[];
  colors: string[];
};

const PageBuilder = ({
  previewPage,
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

    if (blocks) {
      setSelectedItems(getBlockDefaultValues(blocks[i]));
      setSelectedBlock(blocks[i].name);
    }
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

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (updateSuccess) {
      reset();
    }
    setLoading(false);
  }, [updateSuccess]);

  return (
    <Form className="relative w-full" method="POST">
      <input name="previewPageId" value={previewPage?.id} hidden readOnly />
      <input name="itemIndex" value={editingIndex.toString()} hidden readOnly />
      {!editingContent && (
        <div className="flex w-full max-w-full flex-col items-center gap-3 overflow-x-hidden">
          <div className="scrollbar-hide">
            {blocks?.map(({ id, name }: PageBlock, i) => {
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
                    <div className="text-xs"># {i + 1}</div>
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
                      <SquareIconButton
                        iconName="IoArrowDown"
                        size="small"
                        color="primary"
                        onClickFunction={() => changeBlockOrder(i, "down")}
                      />
                    )}

                    {i > 0 && (
                      <SquareIconButton
                        iconName="IoArrowUp"
                        size="small"
                        color="primary"
                        onClickFunction={() => changeBlockOrder(i, "up")}
                      />
                    )}

                    <SquareIconButton
                      iconName="IoPencilSharp"
                      size="small"
                      color="primary"
                      onClickFunction={() => editBlock(i)}
                    />

                    {i > 0 && (
                      <SquareIconButton
                        iconName="IoTrashBin"
                        size="small"
                        color="error"
                        onClickFunction={() => disconnectBlock(id, name)}
                      />
                    )}
                  </div>
                </div>
              );
            })}

            <div
              className="max-w-screen my-3 flex w-[400px] cursor-pointer justify-center rounded-sm border border-brand-white/50 px-3 py-3 transition duration-300 ease-in-out hover:scale-[1.01] max-md:w-[360px]"
              onClick={() => {
                blocks && setEditingIndex(blocks.length);
                setEditingContent(true);
              }}
            >
              <div className="flex items-center justify-center gap-3">
                Add Block +
              </div>
            </div>
          </div>
        </div>
      )}

      {editingContent && (
        <div className="relative mt-3 flex w-full flex-col gap-6 px-3 max-md:px-0">
          <BlockSelect
            selectedBlock={selectedBlock}
            setSelectedBlock={setSelectedBlock}
          />

          <BlockOptionsModule
            selectedBlock={selectedBlock}
            defaultValues={blocks?.[editingIndex]?.blockOptions[0]}
            selectedItems={selectedItems}
            contentType={contentType}
            colors={colors}
          />

          <ContentSearch
            selectedBlock={selectedBlock}
            previewPage={previewPage}
            contentType={contentType}
            setContentType={setContentType}
          />

          <ProductBlockOptions
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            productCategories={productCategories}
            productSubCategories={productSubCategories}
            brands={brands}
            defaultValues={blocks?.[editingIndex]?.content as BlockContent}
          />

          <ArticleBlockOptions
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            articleCategories={articleCategories}
            defaultValues={blocks?.[editingIndex]?.content as BlockContent}
          />

          <TextBlockContentModule
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            defaultValue={blocks?.[editingIndex]?.content as BlockContent}
          />

          <ResultsTable
            selectedBlock={selectedBlock}
            setSelectedItems={handleLimitedItemSelect}
            searchResults={searchResults as Campaign[] | Promotion[] | Brand[]}
            contentType={contentType}
          />

          <ResultsImages
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

          {selectedBlock && (
            <input name="blockName" value={selectedBlock} hidden readOnly />
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

import React, { useEffect, useState } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { blockMaster } from "~/utility/blockMaster/blockMaster";
import type { BlockContentType, BlockName } from "~/utility/blockMaster/types";
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
import type { BlockWithContent, Page } from "~/models/pageBuilder.server";
import type { BlockContentWithDetails } from "~/models/blocks.server";
import BlockSelect from "./BlockSelect";
import ResultsTable from "./Content/ResultsTable";
import ContentSearch from "./Content/ContentSearch";
import ResultsImages from "./Content/ResultsImages";
import SelectedContent from "./Content/SelectedContent";
import ProductBlockOptions from "./Specific/ProductBlockOptions";
import ArticleBlockOptions from "./Specific/ArticleBlockOptions";
import BlockOptionsModule from "./Options";
import TextBlockContentModule from "./Content/TextBlockContent";
import { blockHasMaxContentItems } from "~/helpers/contentHelpers";
import BlockCard from "./BlockCard";
import BoxedTabs from "~/components/Tabs/BoxedTabs";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";

type Props = {
  previewPage: Page;
  blocks: BlockWithContent[] | null;
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
      (e) => selectedBlock === e.name,
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
    const blockIds = JSON.stringify(previewPage.blocks.map((e) => e.id));
    const formData = new FormData();

    formData.set("_action", "rearrange");
    formData.set("previewPageId", previewPage.id.toString() || "");
    formData.set("blocks", blockIds || "");
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

  const [tabNames, setTabNames] = useState<string[]>(["block"]);
  const [activeTab, setActiveTab] = useState<string>(tabNames?.[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (selectedBlock && blockHasMaxContentItems(selectedBlock)) {
      if (!selectedItems || selectedItems.length === 0) {
        setTabNames(["content", "block"]);
      } else {
        setTabNames(["content", "block", "items"]);
      }
    } else {
      setTabNames(["block"]);
    }
  }, [selectedBlock, selectedItems]);

  return (
    <Form className="relative w-full" method="POST">
      <input name="previewPageId" value={previewPage?.id} hidden readOnly />
      <input name="itemIndex" value={editingIndex.toString()} hidden readOnly />

      {!editingContent && (
        <div className="scrollbar-hide mx-auto mt-3 flex w-[520px] max-w-full flex-col items-center gap-3 overflow-x-hidden px-3">
          {blocks?.map(({ id, name, label }: BlockWithContent, i) => {
            return (
              <React.Fragment key={"BlockCard_" + i}>
                <BlockCard
                  blockCount={blocks.length}
                  index={i}
                  name={name}
                  label={label}
                  onChangeOrder={(dir) => changeBlockOrder(i, dir)}
                  onClick={() => editBlock(i)}
                  onDelete={() => disconnectBlock(id.toString(), name)}
                />
              </React.Fragment>
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
      )}

      {editingContent && (
        <div className="relative mt-3 flex w-full flex-col gap-6 px-3 max-md:px-0">
          <BlockSelect
            selectedBlock={selectedBlock}
            setSelectedBlock={setSelectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />

          {/* START */}
          <div
            className={`${
              !selectedBlock || tabNames.length === 1 ? "hidden" : ""
            }`}
          >
            <BoxedTabs
              tabNames={tabNames}
              dynamicTabNames={true}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
          </div>

          <div className={`${activeTab !== "content" && "hidden"}`}>
            <ContentSearch
              selectedBlock={selectedBlock}
              previewPage={previewPage}
              contentType={contentType}
              setContentType={setContentType}
            />

            <ResultsTable
              selectedBlock={selectedBlock}
              setSelectedItems={handleLimitedItemSelect}
              searchResults={
                searchResults as Campaign[] | Promotion[] | Brand[]
              }
              contentType={contentType}
              selectedItems={selectedItems}
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
          </div>

          <details className="collapse collapse-plus grid !max-w-full !rounded-sm bg-brand-white/20">
            <summary className="collapse-title text-xl font-medium">
              Block Label
            </summary>
            <div className="flex max-w-full flex-wrap justify-start !gap-3 px-3 pb-3 max-md:justify-center max-md:px-0">
              <BasicInput
                name="blockLabel"
                type="text"
                label="Block Label"
                placeholder="Label"
                labelStyle="text-brand-white"
                customWidth="pl-3 w-[215px] pb-3"
                defaultValue={blocks?.[editingIndex]?.label}
              />
            </div>
          </details>

          <BlockOptionsModule
            selectedBlock={selectedBlock}
            defaultValues={blocks?.[editingIndex]?.blockOptions[0]}
            selectedItems={selectedItems}
            colors={colors}
            activeTab={activeTab}
          />

          <div className={`${activeTab !== "block" && "hidden"}`}>
            <ProductBlockOptions
              selectedBlock={selectedBlock}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              productCategories={productCategories}
              productSubCategories={productSubCategories}
              brands={brands}
              defaultValues={
                blocks?.[editingIndex]?.content as BlockContentWithDetails
              }
            />

            <ArticleBlockOptions
              selectedBlock={selectedBlock}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              articleCategories={articleCategories}
              defaultValues={
                blocks?.[editingIndex]?.content as BlockContentWithDetails
              }
            />

            <TextBlockContentModule
              selectedBlock={selectedBlock}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              defaultValue={
                blocks?.[editingIndex]?.content as BlockContentWithDetails
              }
            />
          </div>

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

          {/* END */}

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

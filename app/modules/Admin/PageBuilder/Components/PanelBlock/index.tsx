import React, { useEffect, useState } from "react";
import BoxedTabs from "~/components/Tabs/BoxedTabs";
import { blockMaster } from "~/utility/blockMaster/blockMaster";
import { blockHasMaxContentItems } from "~/helpers/contentHelpers";
import type { BlockContentWithDetails } from "~/models/blocks.server";
import type { Brand, Campaign, Image, Promotion } from "@prisma/client";
import type { BlockWithContent, Page } from "~/models/pageBuilder.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import type { BlockContentType, BlockName } from "~/utility/blockMaster/types";
import type { ProductCategoryWithDetails } from "~/models/productCategories.server";
import type { ArticleCategoryWithDetails } from "~/models/articleCategories.server";
import type { ProductSubCategoryWithDetails } from "~/models/productSubCategories.server";
import OptionsModule from "../Options";
import BlockSelect from "../BlockSelect";
import ResultsTable from "../Content/ResultsTable";
import ContentSearch from "../Content/ContentSearch";
import ResultsImages from "../Content/ResultsImages";
import SelectedContent from "../Content/SelectedContent";
import TextBlockContentModule from "../Content/TextBlockContent";
import ProductBlockOptions from "../Specific/ProductBlockOptions";
import ArticleBlockOptions from "../Specific/ArticleBlockOptions";

type Props = {
  articleCategories: ArticleCategoryWithDetails[];
  brands: Brand[] | null;
  colors: string[];
  currentBlocks: BlockWithContent[] | null;
  editingIndex: number;
  loading: boolean;
  previewPage: Page;
  productCategories: ProductCategoryWithDetails[];
  productSubCategories: ProductSubCategoryWithDetails[];
  reset: () => void;
  searchResults: any;
  selectedBlock: BlockName | undefined;
  selectedItems: ContentSelection[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedBlock: React.Dispatch<React.SetStateAction<BlockName | undefined>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<ContentSelection[]>>;
};

const PanelBlock = ({
  articleCategories,
  brands,
  colors,
  currentBlocks,
  editingIndex,
  loading,
  previewPage,
  productCategories,
  productSubCategories,
  reset,
  searchResults,
  selectedBlock,
  selectedItems,
  setLoading,
  setSelectedBlock,
  setSelectedItems,
}: Props) => {
  const [contentType, setContentType] = useState<BlockContentType>();

  const [tabNames, setTabNames] = useState<string[]>(["block"]);
  const [activeTab, setActiveTab] = useState<string>(tabNames?.[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

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
    <div className="relative flex w-full flex-col max-md:px-0 bg-brand-black max-md:fixed max-md:top-0 max-md:h-[100dvh] max-md:overflow-y-scroll">
      <div className="relative flex w-full flex-col overflow-y-scroll scrollbar-hide max-h-[calc(100vh-100px] px-3">
        <BlockSelect
          selectedBlock={selectedBlock}
          setSelectedBlock={setSelectedBlock}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />

        <div
          className={`max-w-[600px] relative left-[50%] translate-x-[-50%]
          ${!selectedBlock || tabNames.length === 1 ? "hidden" : ""}`}
        >
          <BoxedTabs
            tabNames={tabNames}
            dynamicTabNames={true}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            extendStyle="mb-6"
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
            searchResults={searchResults as Campaign[] | Promotion[] | Brand[]}
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

        {/* <details className="collapse collapse-plus grid !max-w-full !rounded-sm bg-brand-white/20">
              <summary className="collapse-title text-xl font-medium text-brand-white">
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
            </details> */}

        <OptionsModule
          selectedBlock={selectedBlock}
          defaultValues={currentBlocks?.[editingIndex]?.blockOptions[0]}
          selectedItems={selectedItems}
          colors={colors}
          activeTab={activeTab}
        />

        <div className={`${activeTab !== "block pb-6" && "hidden"}`}>
          <ProductBlockOptions
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            productCategories={productCategories}
            productSubCategories={productSubCategories}
            brands={brands}
            defaultValues={
              currentBlocks?.[editingIndex]?.content as BlockContentWithDetails
            }
          />

          <ArticleBlockOptions
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            articleCategories={articleCategories}
            defaultValues={
              currentBlocks?.[editingIndex]?.content as BlockContentWithDetails
            }
          />

          <TextBlockContentModule
            selectedBlock={selectedBlock}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            defaultValue={
              currentBlocks?.[editingIndex]?.content as BlockContentWithDetails
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
      </div>

      <div className="relative bottom-0 left-1/2 translate-x-[-50%] bg-brand-black pt-6 pb-3 w-full border-t border-t-brand-white/25 mt-3">
        <BackSubmitButtons
          value="update"
          divider={false}
          loading={loading}
          setLoading={setLoading}
          hideSubmit={!selectedBlock}
          backFunction={reset}
          requiredValueToSubmit={
            selectedBlock && blockRequiresContent(selectedBlock)
              ? selectedItems && selectedItems.length > 0
              : true
          }
          validationMessage="Content is Required."
        />
      </div>
    </div>
  );
};

export default PanelBlock;

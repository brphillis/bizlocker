import { useEffect, useState } from "react";
import { Form, Outlet, useActionData, useLoaderData } from "@remix-run/react";
import useNotification from "~/hooks/PageNotification";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import { type BlockWithContent, type Page } from "~/models/pageBuilder.server";
import type { BlockName } from "~/utility/blockMaster/types";
import type { pageBuilderLoader } from "./index.server";
import PanelPage from "./Components/PanelPage";
import PanelBlock from "./Components/PanelBlock";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";

export const PageBuilderModule = () => {
  const {
    articleCategories,
    blocks,
    brands,
    colors,
    currentPreviewPage,
    publishedPage,
    pageType,
    previewPages,
    productCategories,
    productSubCategories,
  } = useLoaderData<typeof pageBuilderLoader>();

  const {
    actionBlocks,
    actionPreview,
    metaValidationError,
    searchResults,
    updateSuccess,
    publishSuccess,
    notification,
    revertSuccess,
  } = (useActionData() as ActionReturnTypes) || {};

  useNotification(notification);

  const [previewPage, setPreviewPage] = useState<Page | null>(
    currentPreviewPage,
  );

  const [currentBlocks, setCurrentBlocks] = useState<BlockWithContent[] | null>(
    blocks || null,
  );

  const [selectedBlock, setSelectedBlock] = useState<BlockName | undefined>();
  const [editingContent, setEditingContent] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<ContentSelection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const reset = () => {
    setEditingContent(false);
    setSelectedBlock(undefined);
    setSelectedItems([]);
  };

  useEffect(() => {
    if (currentPreviewPage && !actionPreview) {
      setPreviewPage(currentPreviewPage);
    }
    if (actionPreview) {
      setPreviewPage(actionPreview);
    }
    if (blocks && !actionBlocks) {
      setCurrentBlocks(blocks);
    }
    if (actionBlocks) {
      setCurrentBlocks(actionBlocks);
    }
  }, [actionPreview, actionBlocks, blocks, currentPreviewPage, previewPage]);

  useEffect(() => {
    setLoading(false);
  }, [updateSuccess]);

  return (
    <>
      <AdminPageWrapper>
        <PatternBackground
          name="isometric"
          backgroundColor={getThemeColorValueByName("brand-black")}
          patternColor={getThemeColorValueByName("brand-white")}
          patternOpacity={0.2}
          patternSize={140}
          brightness={-1.5}
        />

        <div className="flex flex-row justify-start border-x border-x-brand-black/75 max-w-[100vw] h-[100dvh] max-md:max-h-max">
          <Form
            method="POST"
            className={`relative flex flex-row w-full max-h-[100vh] max-md:max-h-max max-md:flex-col`}
          >
            <PanelPage
              articleCategories={articleCategories}
              colors={colors}
              currentBlocks={currentBlocks}
              metaValidationError={metaValidationError}
              pageType={pageType}
              previewPage={previewPage}
              previewPages={previewPages}
              publishedPage={publishedPage}
              publishSuccess={publishSuccess}
              revertSuccess={revertSuccess}
              setEditingContent={setEditingContent}
              setEditingIndex={setEditingIndex}
              setSelectedBlock={setSelectedBlock}
              setSelectedItems={setSelectedItems}
            />

            {editingContent && previewPage && (
              <PanelBlock
                articleCategories={articleCategories}
                brands={brands}
                colors={colors}
                currentBlocks={currentBlocks}
                editingIndex={editingIndex}
                loading={loading}
                previewPage={previewPage}
                productCategories={productCategories}
                productSubCategories={productSubCategories}
                reset={reset}
                searchResults={searchResults}
                selectedBlock={selectedBlock}
                selectedItems={selectedItems}
                setLoading={setLoading}
                setSelectedBlock={setSelectedBlock}
                setSelectedItems={setSelectedItems}
              />
            )}

            <input
              name="previewPageId"
              value={previewPage?.id}
              hidden
              readOnly
            />
            <input
              name="itemIndex"
              value={editingIndex.toString()}
              hidden
              readOnly
            />
          </Form>
        </div>
      </AdminPageWrapper>
      <Outlet />
    </>
  );
};

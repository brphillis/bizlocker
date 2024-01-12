import type { ActionReturnTypes } from "~/utility/actionTypes";
import { Form, Outlet, useActionData, useLoaderData } from "@remix-run/react";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import LargeCollapse from "~/components/Collapse/LargeCollapse";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";
import { useEffect, useState } from "react";
import SquareIconButton from "~/components/Buttons/SquareIconButton";
import { type Page, type BlockWithContent } from "~/models/pageBuilder.server";
import { type PageType } from "~/utility/pageBuilder";
import useNotification from "~/hooks/PageNotification";
import type { pageBuilderLoader } from "./index.server";
import Meta from "./Components/Meta";
import PageBuilder from "./Components";
import VersionControl from "./Components/VersionControl";

export const PageBuilderModule = () => {
  const {
    articleCategories,
    blocks,
    brands,
    colors,
    currentPreviewPage,
    page,
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
  } = (useActionData() as ActionReturnTypes) || {};

  useNotification(notification);

  const [currentVersion, setCurrentVersion] = useState<Page | null>(
    currentPreviewPage,
  );

  const [currentBlocks, setCurrentBlocks] = useState<BlockWithContent[] | null>(
    blocks || null,
  );

  useEffect(() => {
    if (currentPreviewPage && !actionPreview) {
      setCurrentVersion(currentPreviewPage);
    }
    if (actionPreview) {
      setCurrentVersion(actionPreview);
    }
    if (blocks && !actionBlocks) {
      setCurrentBlocks(blocks);
    }
    if (actionBlocks) {
      setCurrentBlocks(actionBlocks);
    }
    console.log("CV", currentVersion);
  }, [actionPreview, actionBlocks, blocks, currentPreviewPage, currentVersion]);

  return (
    <>
      <AdminPageWrapper>
        <div className="relative h-full p-6 max-sm:p-0 sm:w-full">
          <div className="absolute left-0 top-0 h-full w-full bg-brand-white"></div>
          <PatternBackground
            backgroundColor={getThemeColorValueByName("brand-black")}
            brightness={-1.5}
            name="isometric"
            patternColor={getThemeColorValueByName("brand-white")}
            patternOpacity={0.2}
            patternSize={140}
          />

          <div className="flex w-full justify-center">
            <div className="flex flex-col gap-3 rounded-none text-brand-white">
              <div className="relative flex flex-col items-center justify-center gap-6 bg-brand-black py-6 text-center text-xl font-bold text-brand-white max-sm:gap-3">
                <div className="w-full">
                  {page?.title ? page?.title : "Add Page"}
                </div>
                {pageType !== "homePage" && (
                  <Form method="POST" className="absolute right-3">
                    {page?.id && (
                      <input
                        hidden
                        readOnly
                        name="pageId"
                        value={page.id.toString()}
                      />
                    )}
                    <input hidden readOnly name="pageType" value={pageType} />
                    <SquareIconButton
                      color="error"
                      iconName="IoTrashBin"
                      name="_action"
                      size="small"
                      type="submit"
                      value="deletepage"
                    />
                  </Form>
                )}
              </div>

              <Meta
                key={currentVersion?.id}
                articleCategories={articleCategories}
                colors={colors}
                currentVersion={currentVersion}
                metaValidationError={metaValidationError}
                pageType={pageType as PageType}
              />

              {page && currentVersion && (
                <LargeCollapse
                  title="Blocks"
                  forceOpen={true}
                  content={
                    <PageBuilder
                      articleCategories={articleCategories}
                      blocks={currentBlocks}
                      brands={brands}
                      colors={colors}
                      previewPage={currentVersion}
                      productCategories={productCategories}
                      productSubCategories={productSubCategories}
                      searchResults={searchResults}
                      updateSuccess={updateSuccess}
                    />
                  }
                />
              )}

              {page?.previewPage && (
                <VersionControl
                  currentVersion={currentVersion}
                  page={page as Page}
                  previewPages={previewPages}
                  updateSuccess={publishSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </AdminPageWrapper>
      <Outlet />
    </>
  );
};

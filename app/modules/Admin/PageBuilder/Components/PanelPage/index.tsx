import React, { useEffect, useState } from "react";
import { useSearchParams, useSubmit } from "@remix-run/react";
import { IoTrashSharp } from "react-icons/io5";
import type { PreviewPage } from "@prisma/client";
import BoxedTabs from "~/components/Tabs/BoxedTabs";
import TabContent from "~/components/Tabs/TabContent";
import type { PageType } from "~/utility/pageBuilder";
import type { BlockName } from "~/utility/blockMaster/types";
import { getBlockDefaultValues } from "~/helpers/blockHelpers";
import type { BlockWithContent, Page } from "~/models/pageBuilder.server";

import Meta from "../Meta";
import BlockCard from "../BlockCard";
import VersionControl from "../VersionControl";

type Props = {
  articleCategories: SelectValue[];
  colors: string[];
  currentBlocks: BlockWithContent[] | null;
  loading: boolean;
  metaValidationError: string[];
  pageType?: string;
  previewPage: Page | null;
  previewPages?: PreviewPage[] | null;
  publishedPage: Page | null;
  publishSuccess: boolean;
  revertSuccess: boolean;
  setEditingContent: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingIndex: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedBlock: React.Dispatch<React.SetStateAction<BlockName | undefined>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<ContentSelection[]>>;
};

const PanelPage = ({
  articleCategories,
  colors,
  currentBlocks,
  loading,
  metaValidationError,
  pageType,
  previewPage,
  previewPages,
  publishedPage,
  publishSuccess,
  revertSuccess,
  setEditingContent,
  setEditingIndex,
  setLoading,
  setSelectedBlock,
  setSelectedItems,
}: Props) => {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [tabNames, setTabNames] = useState<string[]>(
    id === "add" ? ["settings"] : ["blocks", "settings"],
  );
  const [activeTab, setActiveTab] = useState<string>(tabNames?.[0]);

  const editBlock = (i: number) => {
    setEditingContent(true);
    setEditingIndex(i);

    if (currentBlocks) {
      setSelectedItems(getBlockDefaultValues(currentBlocks[i]));
      setSelectedBlock(currentBlocks[i].name);
    }
  };

  const disconnectBlock = (blockId: string, blockName: BlockName) => {
    if (previewPage) {
      const formData = new FormData();

      formData.set("_action", "delete");
      formData.set("blockName", blockName.toString() || "");
      formData.set("blockId", blockId.toString() || "");
      formData.set("previewPageId", previewPage.id.toString() || "");

      submit(formData, {
        method: "POST",
      });

      setEditingContent(false);
    }
  };

  const handleChangeBlockOrder = (index: number, direction: "up" | "down") => {
    if (previewPage) {
      const blockIds = JSON.stringify(previewPage?.blocks.map((e) => e.id));
      const formData = new FormData();

      formData.set("_action", "rearrange");
      formData.set("previewPageId", previewPage?.id.toString() || "");
      formData.set("blocks", blockIds || "");
      formData.set("index", index.toString() || "");
      formData.set("direction", direction.toString() || "");

      submit(formData, {
        method: "POST",
      });
    }
  };

  const handleDeletePage = () => {
    if (publishedPage) {
      const formData = new FormData();
      formData.set("_action", "deletePage");
      formData.set("pageId", publishedPage?.id?.toString());
      formData.set("pageType", pageType!);

      submit(formData, { method: "POST" });
    }
  };

  useEffect(() => {
    if (id === "add") {
      setTabNames(["settings"]);
    } else {
      setTabNames(["blocks", "settings"]);
    }
  }, [id]);

  return (
    <div className="relative h-[100dvh] overflow-scroll scrollbar-hide w-[360px] min-w-[360px] max-md:min-w-[100vw] bg-brand-black border-r border-r-brand-white/25">
      <BoxedTabs
        tabNames={tabNames}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <TabContent
        activeTab={activeTab}
        tab="blocks"
        children={
          <div className="h-[calc(100vh-55px)] max-w-full overflow-x-hidden">
            <div className="h-[calc(100%-165px)] flex flex-col items-center gap-0 overflow-y-scroll scrollbar-hide">
              <div className="text-brand-white py-3 select-none">
                {previewPage?.title ? previewPage.title : "Add Page"}
              </div>

              {currentBlocks?.map(
                ({ id, name, label }: BlockWithContent, i) => {
                  return (
                    <React.Fragment key={"BlockCard_" + i}>
                      <BlockCard
                        blockCount={currentBlocks.length}
                        index={i}
                        label={label}
                        name={name}
                        onClick={() => editBlock(i)}
                        onChangeOrder={(dir) => handleChangeBlockOrder(i, dir)}
                        onDelete={() => disconnectBlock(id.toString(), name)}
                      />
                    </React.Fragment>
                  );
                },
              )}

              <div
                className={`max-w-full flex items-center justify-center w-full h-[49px] cursor-pointer border-b border-b-brand-white/50 px-3 
                 py-3 transition duration-300 ease-in-out hover:scale-[1.01] hover:text-brand-white text-brand-white/50
                 ${
                   (!currentBlocks ||
                     (currentBlocks && currentBlocks.length === 0)) &&
                   "border-t border-t-brand-white/50"
                 }`}
                onClick={() => {
                  currentBlocks && setEditingIndex(currentBlocks.length);
                  setEditingContent(true);
                }}
              >
                <div>Add Block +</div>
              </div>
            </div>

            {publishedPage?.previewPage && (
              <div className="absolute bottom-0 left-[50%] translate-x-[-50%] w-full">
                <VersionControl
                  currentVersion={previewPage}
                  loading={loading}
                  pageType={pageType as PageType}
                  previewPages={previewPages}
                  publishedPage={publishedPage as Page}
                  setLoading={setLoading}
                  updateSuccess={publishSuccess || revertSuccess}
                />
              </div>
            )}
          </div>
        }
      />

      <TabContent
        activeTab={activeTab}
        tab="settings"
        children={
          <div
            className={`relative flex flex-col ${
              pageType !== "homePage" && "pt-3"
            }`}
          >
            <Meta
              key={previewPage?.id}
              articleCategories={articleCategories!}
              colors={colors}
              currentVersion={previewPage}
              metaValidationError={metaValidationError}
              pageType={pageType as PageType}
            />

            {pageType !== "homePage" && id !== "add" && (
              <div className="absolute top-[5px] right-[5px]">
                <div
                  className="text-brand-white bg-error p-[5px] text-[10px] rounded-sm"
                  onClick={handleDeletePage}
                >
                  <IoTrashSharp />
                </div>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

export default PanelPage;

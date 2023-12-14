import { useEffect, useState } from "react";
import type { BlockOptions } from "@prisma/client";
import type { BlockName } from "~/utility/blockMaster/types";
import { blockMaster } from "~/utility/blockMaster/blockMaster";
import TitleOptions from "./Options/Title";
import StyleOptions from "./Options/Style";
import ShortTextOptions from "./Options/ShortText";
import BackgroundOptions from "./Options/Background";
import BorderOptions from "./Options/Border";
import SortAndOrderOptions from "./Options/SortAndOrder";
import SizeOptions from "./Options/Size";
import FlipAndRotateOptions from "./Options/FlipAndRotate";
import CountOptions from "./Options/Count";
import MarginAndPaddingOptions from "./Options/MarginAndPadding";
import MotionOptions from "./Options/Motion";
import ColumnsAndRowsOptions from "./Options/ColumnsAndRows";
import ItemOptions from "./ItemOptions";
import BoxedTabs from "~/components/Tabs/BoxedTabs";
import { blockHasMaxContentItems } from "~/helpers/blockContentHelpers";

type Props = {
  selectedItems: ContentSelection[];
  colors: string[];
  selectedBlock?: BlockName;
  defaultValues?: BlockOptions;
};

const BlockOptionsModule = ({
  selectedBlock,
  defaultValues,
  selectedItems,
  colors,
}: Props) => {
  const selectedBlockOptions = blockMaster.find(
    (e) => e.name === selectedBlock
  )?.options;

  const [tabNames, setTabNames] = useState<string[]>(["block"]);
  const [activeTab, setActiveTab] = useState<string>(tabNames?.[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (selectedBlock && blockHasMaxContentItems(selectedBlock)) {
      setTabNames(["block", "items"]);
    } else {
      setTabNames(["block"]);
    }
  }, [selectedBlock]);

  return (
    <>
      {selectedBlock && (
        <div className="!min-h-[300px] w-full pb-3">
          <div className="mx-auto mb-6 block max-w-[400px] rounded-sm">
            <BoxedTabs
              tabNames={tabNames}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          <div
            className={`flex flex-wrap gap-6 ${
              activeTab !== "block" && "hidden"
            }`}
          >
            <StyleOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <TitleOptions
              selectedBlock={selectedBlock}
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <ShortTextOptions
              selectedBlock={selectedBlock}
              colors={colors}
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <BackgroundOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <BorderOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <SortAndOrderOptions
              selectedBlock={selectedBlock}
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <SizeOptions
              selectedBlock={selectedBlock}
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <FlipAndRotateOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <CountOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <MarginAndPaddingOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <MotionOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <ColumnsAndRowsOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />
          </div>

          <div
            className={`flex flex-wrap gap-6 ${
              activeTab !== "items" && "hidden"
            }`}
          >
            <ItemOptions
              selectedItems={selectedItems}
              selectedBlockOptions={selectedBlockOptions}
              defaultValues={defaultValues}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BlockOptionsModule;

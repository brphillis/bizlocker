import type { BlockOptions } from "@prisma/client";
import type { BlockName } from "~/utility/blockMaster/types";
import { blockMaster } from "~/utility/blockMaster/blockMaster";
import TitleOptions from "./BlockOptions/Title";
import StyleOptions from "./BlockOptions/Style";
import ShortTextOptions from "./BlockOptions/ShortText";
import BackgroundOptions from "./BlockOptions/Background";
import BorderOptions from "./BlockOptions/Border";
import SortAndOrderOptions from "./BlockOptions/SortAndOrder";
import SizeOptions from "./BlockOptions/Size";
import FlipAndRotateOptions from "./BlockOptions/FlipAndRotate";
import CountOptions from "./BlockOptions/Count";
import MarginAndPaddingOptions from "./BlockOptions/MarginAndPadding";
import MotionOptions from "./BlockOptions/Motion";
import ColumnsAndRowsOptions from "./BlockOptions/ColumnsAndRows";
import ItemOptions from "./ItemOptions";
import ButtonOptions from "./BlockOptions/Buttons";
import ColorOptions from "./BlockOptions/Colors";

type Props = {
  selectedItems: ContentSelection[];
  colors: string[];
  selectedBlock?: BlockName;
  defaultValues?: BlockOptions;
  activeTab: string;
};

const OptionsModule = ({
  selectedBlock,
  defaultValues,
  selectedItems,
  colors,
  activeTab,
}: Props) => {
  const selectedBlockOptions = blockMaster.find((e) => e.name === selectedBlock)
    ?.options;

  return (
    <>
      {selectedBlock && (
        <div className="w-full">
          <div
            className={`flex flex-wrap gap-3 
            ${activeTab !== "block" ? "hidden" : "pb-3"}`}
          >
            <BackgroundOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <BorderOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <ButtonOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <ColorOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <ColumnsAndRowsOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <CountOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <FlipAndRotateOptions
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

            <ShortTextOptions
              selectedBlock={selectedBlock}
              colors={colors}
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <SizeOptions
              selectedBlock={selectedBlock}
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <SortAndOrderOptions
              selectedBlock={selectedBlock}
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <StyleOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <TitleOptions
              selectedBlock={selectedBlock}
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

export default OptionsModule;

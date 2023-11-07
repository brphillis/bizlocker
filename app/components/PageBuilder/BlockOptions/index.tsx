import { blockMaster } from "~/utility/blockMaster";
import TitleOptions from "./Title";
import StyleOptions from "./Style";
import ShortTextOptions from "./ShortText";
import BackgroundOptions from "./Background";
import BorderOptions from "./Border";
import SortAndOrderOptions from "./SortAndOrder";
import SizeOptions from "./Size";
import FlipAndRotateOptions from "./FlipAndRotate";
import CountOptions from "./Count";
import MarginAndPaddingOptions from "./MarginAndPadding";
import MotionOptions from "./Motion";
import ColumnsAndRowsOptions from "./ColumnsAndRows";
import ItemColorOptions from "./ItemColors";
import ItemFilterOptions from "./ItemFilters";
import LinkOptions from "./Links";
import ItemTitleOptions from "./ItemTitles";
import ItemBorderOptions from "./ItemBorders";

type Props = {
  selectedBlock: BlockName | undefined;
  defaultValues: BlockOptions;
  selectedItems: ContentSelection[];
  contentType: BlockContentType | undefined;
  colors: string[];
};

const BlockOptions = ({
  selectedBlock,
  defaultValues,
  selectedItems,
  contentType,
  colors,
}: Props) => {
  const selectedBlockOptions = blockMaster.find(
    (e) => e.name === selectedBlock
  )?.options;

  return (
    <>
      {selectedBlock && (
        <div className="w-full pb-3">
          <p className="mb-3 px-1 pt-3 font-semibold text-brand-white">
            Options
          </p>
          <div className="flex flex-wrap gap-6">
            <StyleOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <TitleOptions
              selectedBlock={selectedBlock}
              colors={colors}
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
              colors={colors}
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <BorderOptions
              colors={colors}
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

            <ItemBorderOptions
              colors={colors}
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
            />

            <ItemColorOptions
              colors={colors}
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
              selectedItems={selectedItems}
            />

            <ItemFilterOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
              selectedItems={selectedItems}
            />

            <ItemTitleOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
              selectedItems={selectedItems}
            />

            <LinkOptions
              defaultValues={defaultValues}
              selectedBlockOptions={selectedBlockOptions}
              selectedItems={selectedItems}
              contentType={contentType}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BlockOptions;

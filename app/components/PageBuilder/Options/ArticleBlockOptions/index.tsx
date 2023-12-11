import type { ArticleCategory } from "@prisma/client";
import type { BlockContent } from "~/models/blocks.server";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import type { BlockContentType, BlockName } from "~/utility/blockMaster/types";

type Props = {
  selectedBlock: BlockName | undefined;
  selectedItems: ContentSelection[];
  setSelectedItems: Function;
  articleCategories: ArticleCategory[];
  defaultValues: BlockContent;
};

const ArticleBlockOptions = ({
  selectedItems,
  setSelectedItems,
  selectedBlock,
  defaultValues,
  articleCategories,
}: Props) => {
  const selectItem = (type: BlockContentType, contentId: number) => {
    setSelectedItems((prevSelectedItems: any) => {
      if (!Array.isArray(prevSelectedItems)) {
        prevSelectedItems = [];
      }
      return [...prevSelectedItems, { type, contentId }];
    });
  };

  return (
    <>
      {selectedBlock === "article" && (
        <div className="w-full pb-3">
          <p className="mb-3 px-1 pt-3 font-semibold text-brand-white">
            Filters
          </p>
          <div className="flex flex-wrap gap-3">
            <BasicSelect
              name="articleCategory"
              label="Category"
              labelColor="text-brand-white"
              placeholder="Select a Category"
              selections={articleCategories as unknown as SelectValue[]}
              defaultValue={defaultValues?.articleCategoryId?.toString()}
              onChange={(selectedValue) => {
                selectItem(
                  "articleCategory",
                  parseInt(selectedValue as string)
                );
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleBlockOptions;

import { ArticleCategory } from "@prisma/client";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { BlockContentWithDetails } from "~/models/Blocks/types";
import { BlockContentType, BlockName } from "~/utility/blockMaster/types";

type Props = {
  selectedBlock?: BlockName;
  setSelectedItems: (items: ContentSelection[]) => void;
  articleCategories: ArticleCategory[];
  defaultValues: BlockContentWithDetails;
};

const ArticleBlockOptions = ({
  setSelectedItems,
  selectedBlock,
  defaultValues,
  articleCategories,
}: Props) => {
  const selectItem = (type: BlockContentType, contentId: number) => {
    // @ts-expect-error: expected typeshift
    setSelectedItems((prevSelectedItems: ContentSelection[]) => {
      const itemsArray: ContentSelection[] = Array.isArray(prevSelectedItems)
        ? (prevSelectedItems as ContentSelection[])
        : [];
      return [...itemsArray, { type, contentId }];
    });
  };

  return (
    <details className="collapse collapse-plus !hidden !max-w-full !rounded-sm bg-brand-white/20 [&:has(div>div)]:!grid">
      <summary className="collapse-title text-xl font-medium text-brand-white">
        Article Filters
      </summary>
      <div className="collapse-content relative sm:!px-3">
        {selectedBlock === "article" && (
          <div className="w-full pb-3">
            <p className="mb-3 px-1 pt-3 font-semibold text-brand-white">
              Filters
            </p>
            <div className="flex flex-wrap gap-3">
              <BasicSelect
                name="articleCategory"
                label="Category"
                labelStyle="text-brand-white"
                placeholder="Select a Category"
                selections={articleCategories as unknown as SelectValue[]}
                defaultValue={defaultValues?.articleCategory?.[0].id?.toString()}
                onChange={(selectedValue) => {
                  selectItem(
                    "articleCategory",
                    parseInt(selectedValue as string),
                  );
                }}
              />
            </div>
          </div>
        )}
      </div>
    </details>
  );
};

export default ArticleBlockOptions;

import SelectArticleCategory from "~/components/Forms/Select/SelectArticleCategory";

type Props = {
  selectedBlock: BlockName | undefined;
  articleCategories: ArticleCategory[];
  defaultValues: ArticleBlockContent;
};

const ArticleBlockOptions = ({
  selectedBlock,
  defaultValues,
  articleCategories,
}: Props) => {
  return (
    <>
      {selectedBlock === "article" && (
        <div className="w-full pb-3">
          <p className="mb-3 px-1 pt-3 font-semibold text-brand-white">
            Filters
          </p>
          <div className="flex flex-wrap gap-3 !text-brand-white">
            <SelectArticleCategory
              articleCategories={articleCategories}
              defaultValue={defaultValues?.articleCategoryId?.toString()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleBlockOptions;

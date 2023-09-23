import BasicSelect from "~/components/Forms/Select/BasicSelect";

type Props = {
  selectedBlock: BlockName | undefined;
  articleCategories: ArticleCategory[];
  defaultValues: ArticleBlockContent[];
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
            <BasicSelect
              label="Category"
              name="articleCategory"
              placeholder="Select a Category"
              selections={articleCategories as unknown as SelectValue[]}
              defaultValue={defaultValues?.[0]?.articleCategoryId?.toString()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleBlockOptions;

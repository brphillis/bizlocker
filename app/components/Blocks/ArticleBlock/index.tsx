import ArticleGrid from "~/components/Grids/ArticleGrid";

type Props = {
  content: ArticleBlockContent[];
  options: BlockOptions;
  articles: Article[] | undefined;
};

const ArticleBlock = ({ content, options, articles }: Props) => {
  const determineSortPhrase = (sortBy: SortBy) => {
    if (sortBy && sortBy === "createdAt") {
      return "Latest Article in  ";
    }
    if (sortBy && sortBy === "title") {
      return "Articles about  ";
    }
  };

  const determineDisplayedFilter = (content: ArticleBlockContent) => {
    if (content?.articleCategory?.name) {
      return content?.articleCategory?.name;
    }
  };

  return (
    <>
      {options?.sortBy && content?.[0].articleCategory?.name && (
        <p className="self-start pl-3 text-xl font-bold md:pl-1">
          {options.sortBy ? determineSortPhrase(options?.sortBy) : null}
          <span className="text-2xl">
            {determineDisplayedFilter(content[0])}
          </span>
        </p>
      )}

      {articles && <ArticleGrid articles={articles} />}
    </>
  );
};

export default ArticleBlock;

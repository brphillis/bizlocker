import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import ArticleGrid from "~/components/Grids/ArticleGrid";

type Props = {
  content: ArticleBlockContent[];
  options: BlockOptions;
};

const ArticleBlock = ({ content, options }: Props) => {
  const [currentArticles, setCurrentArticles] = useState<Article[]>();
  const fetcher = useFetcher();
  const articleCategory = content?.[0]?.articleCategory?.id;
  const count = options?.count;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      let query = "/api/searchArticles";

      const params = [];
      if (articleCategory !== null && articleCategory !== undefined) {
        params.push(`articleCategory=${articleCategory}`);
      }

      if (count !== null && count !== undefined) {
        params.push(`perPage=${count.toString()}`);
      }

      if (params.length > 0) {
        query += `?${params.join("&")}`;
      }

      fetcher.load(query);
    }

    if (fetcher.data && !currentArticles) {
      const { articles } = fetcher.data;
      setCurrentArticles(articles);
    }
  }, [fetcher, currentArticles, content, count, articleCategory]);

  const determineSortPhrase = (sortBy: SortBy) => {
    if (sortBy === "createdAt") {
      return "Latest Article in  ";
    }
    if (sortBy === "name") {
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
      {options.sortBy && content?.[0].articleCategory?.name && (
        <p className="self-start pl-3 text-xl font-bold md:pl-1">
          {options.sortBy ? determineSortPhrase(options.sortBy) : null}
          <span className="text-2xl">
            {determineDisplayedFilter(content[0])}
          </span>
        </p>
      )}

      {currentArticles && <ArticleGrid articles={currentArticles} />}
    </>
  );
};

export default ArticleBlock;

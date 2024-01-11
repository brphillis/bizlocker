import type { ArticleCategory, BlockOptions } from "@prisma/client";
import type { BlockContentWithDetails } from "~/models/blocks.server";
import ArticleGrid from "~/components/Grids/ArticleGrid";
import type { ArticleWithContent } from "~/models/articles.server";

type Props = {
  content: BlockContentWithDetails;
  options: BlockOptions[];
};

const ArticleBlock = ({ content, options: optionsArray }: Props) => {
  const options = optionsArray[0];
  const articles = content?.article as ArticleWithContent[];
  const articleCategory = content?.articleCategory?.[0] as ArticleCategory;

  const determineSortPhrase = (sortBy: SortBy) => {
    if (sortBy && sortBy === "createdAt") {
      return "Latest Article in  ";
    }
    if (sortBy && sortBy === "title") {
      return "Articles about  ";
    }
  };

  return (
    <>
      {options?.sortBy && articleCategory?.name && (
        <p className="select-none self-start pl-3 text-xl font-bold md:pl-1">
          {options.sortBy ? determineSortPhrase(options?.sortBy) : null}
          <span className="text-2xl">{articleCategory?.name}</span>
        </p>
      )}

      {options?.sortBy && !articleCategory?.name && (
        <p className="self-start pl-3 text-2xl font-bold md:pl-1">
          Our Latest Articles
        </p>
      )}

      {articles && <ArticleGrid articles={articles} />}
    </>
  );
};

export default ArticleBlock;

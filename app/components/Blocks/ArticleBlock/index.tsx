import { ArticleCategory, BlockOptions } from "@prisma/client";
import ArticleGrid from "~/components/Grids/ArticleGrid";
import { ArticleWithContent } from "~/models/Articles/types";
import { BlockContentSorted } from "~/models/Blocks/types";

type Props = {
  content: BlockContentSorted[];
  options: BlockOptions[];
};

const ArticleBlock = ({ content, options: optionsArray }: Props) => {
  const options = optionsArray[0];
  const articles = content.map((e) => e.article) as ArticleWithContent[];
  const articleCategory = content[0]?.articleCategory as ArticleCategory;

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

import React from "react";
import { ArticleWithContent } from "~/models/Articles/types";
import ArticleCard from "../../Cards/ArticleCard";

type Props = {
  articles: ArticleWithContent[];
  hasDescription?: boolean;
};

const ArticleGrid = ({ articles, hasDescription }: Props) => {
  const cols = 3;
  return (
    <div className="h-max w-full">
      <div
        style={{
          gridTemplateColumns: cols
            ? `repeat(${cols}, minmax(0, 1fr))`
            : "repeat(4, minmax(0, 1fr))",
        }}
        className="relative grid place-items-center gap-3 gap-y-3 px-3 pb-3 max-lg:!grid-cols-2 max-md:!grid-cols-2 max-sm:!grid-cols-1 md:gap-6 md:gap-y-6 xl:px-0"
      >
        {articles?.map((article) => (
          <React.Fragment key={article.id}>
            <ArticleCard
              article={{ ...article, id: article.id }}
              hasDescription={hasDescription}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ArticleGrid;

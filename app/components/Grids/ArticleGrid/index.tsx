import ArticleCard from "../../Cards/ArticleCard";
import React from "react";

type Props = {
  articles: Article[];
  hasDescription?: boolean;
};

const ArticleGrid = ({ articles, hasDescription }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-6 gap-y-6 px-2 py-6 md:grid-cols-3">
      {articles?.map((article) => (
        <React.Fragment key={article.id}>
          <ArticleCard
            article={{ ...article, id: article.id }}
            hasDescription={hasDescription}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ArticleGrid;

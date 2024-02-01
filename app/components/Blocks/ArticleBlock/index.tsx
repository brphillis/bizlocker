import { Article, BlockOptions } from "@prisma/client";
import ArticleGrid from "~/components/Grids/ArticleGrid";
import { BlockContentSorted } from "~/models/Blocks/types";
import Container from "../_BlockComponents/Container";
import Title from "../_BlockComponents/Title";
import Spinner from "~/components/Spinner";

type Props = {
  content: BlockContentSorted[];
  options: BlockOptions[];
};

const ArticleBlock = ({ content, options }: Props) => {
  const { title } = options[0] || {};

  const articles = content
    .map((e) => e.article as Article)
    .filter((article) => article !== undefined);

  return (
    <Container options={options[0]}>
      <>{title && <Title blockOptions={options[0]} />}</>

      {articles && <ArticleGrid articles={articles} />}

      <>
        {!articles && (
          <div className="flex w-full items-center justify-center">
            <Spinner mode="circle" />
          </div>
        )}
      </>
    </Container>
  );
};

export default ArticleBlock;

import { IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

type Props = {
  article: Article;
  hasDescription?: boolean;
};

const ArticleCard = ({ article, hasDescription }: Props) => {
  const navigate = useNavigate();
  const image = article?.thumbnail?.url;
  return (
    <div
      className="group relative flex min-h-[270px] w-auto cursor-pointer flex-col"
      onClick={() => navigate(`/article/${article.title}`)}
    >
      <div className="relative h-full w-auto drop-shadow-xl">
        <img
          className="h-full w-full object-cover object-top"
          src={image || ""}
          alt={article.title + "_image"}
        />
        <div className="absolute bottom-0 flex w-full justify-between rounded bg-black bg-opacity-20 px-4 py-3 text-white drop-shadow-lg backdrop-blur-lg">
          <div>
            <p className="font-bold">{article.title}</p>
            <div>
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="flex flex-col items-center gap-y-2 md:flex-row md:gap-x-2">
            {article.articleCategories?.map(({ id, name }: ArticleCategory) => {
              return (
                <div
                  key={id + name}
                  className="rounded-full bg-primary px-3 py-1 text-center text-sm font-semibold text-white"
                >
                  <p>{name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {hasDescription && (
        <div className="relative min-h-[112px] bg-base-300 px-4">
          <div className="mt-5 flex-1">
            <div className="line-clamp-2">DESCRIPTION</div>
          </div>

          <p className="absolute bottom-2 left-4 mt-5 flex items-center font-bold group-hover:underline">
            Read More
            <IoArrowForward className="ml-2 h-4 w-4" />
          </p>
        </div>
      )}
    </div>
  );
};

export default ArticleCard;

import { useNavigate } from "@remix-run/react";

type Props = {
  content: Campaign[] | Promotion[];
};

const TileBlock = ({ content }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen grid grid-cols-2 gap-3 gap-y-6 sm:gap-6">
      {content?.map(({ tileImage, name }: Promotion | Campaign) => {
        return (
          <img
            key={"tileImage_" + name}
            className="h-[12rem] w-[12rem] cursor-pointer transition duration-300 ease-in-out hover:scale-[1.01] sm:h-[39rem] sm:w-[39rem]"
            onClick={() => navigate(`/promotion/${name}`)}
            src={tileImage.url}
            alt={"tileImage_" + name}
          />
        );
      })}
    </div>
  );
};

export default TileBlock;

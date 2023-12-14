import { useNavigate } from "@remix-run/react";

type Props = {
  borderRadius: string | null | undefined;
  contentType: string | undefined;
  filter: string;
  imageSrc: string;
  itemBackgroundColor: string;
  joinedContent: any;
  link: string;
  name: string;
};

const ContentTile = ({
  filter,
  imageSrc,
  itemBackgroundColor,
  link,
  name,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div className={`h-full w-full ${itemBackgroundColor}`}>
      <img
        className={`object-fit h-full w-full ${filter}`}
        onClick={() => link && navigate(link)}
        src={imageSrc}
        alt={name}
      />
    </div>
  );
};

export default ContentTile;

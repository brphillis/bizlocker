type Props = {
  content: Campaign[] | Promotion[];
};

const BannerBlock = ({ content }: Props) => {
  return (
    <div className="max-w-screen w-screen sm:w-[1280px]">
      <img
        src={content[0].bannerImage.url}
        alt={"campaign_bannerImage"}
        className="max-w-screen h-[120px] w-full object-cover sm:h-max"
      />
    </div>
  );
};

export default BannerBlock;

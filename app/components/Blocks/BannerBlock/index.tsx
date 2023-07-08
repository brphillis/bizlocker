type Props = {
  image: Image;
};

const BannerBlock = ({ image }: Props) => {
  return (
    <div className="max-w-screen w-screen sm:w-[1280px]">
      <img
        src={image?.url}
        alt="banner_image"
        className="max-w-screen h-[120px] w-full object-cover sm:h-max"
      />
    </div>
  );
};

export default BannerBlock;

type Props = {
  containerStyle: string;
  SEOWords: string[];
};

const SEOCardSkeleton = ({ containerStyle, SEOWords }: Props) => {
  return (
    <div className={`relative ${containerStyle}`}>
      <div className="skeleton relative h-full w-full"></div>

      <div className="absolute left-[50%] top-[25%] flex translate-x-[-50%] flex-col items-center gap-3 font-bold text-brand-white/10">
        {SEOWords?.map((word, i) => {
          return (
            <h2 key={"carousel_SEO_word_" + word + "_" + i} className="">
              {word}
            </h2>
          );
        })}
      </div>
    </div>
  );
};

export default SEOCardSkeleton;

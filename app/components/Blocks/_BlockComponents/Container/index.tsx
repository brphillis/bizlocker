import { BlockOptions } from "@prisma/client";
import PatternBackground from "~/components/Layout/Backgrounds/PatternBackground";
import { getThemeColorValueByName } from "~/utility/colors";

type Props = {
  children: JSX.Element | JSX.Element[];
  options: BlockOptions;
};

const Container = ({ children, options }: Props) => {
  const {
    backgroundBrightnessPrimary,
    backgroundColorPrimary,
    backgroundPatternColorPrimary,
    backgroundPatternNamePrimary,
    backgroundPatternSizePrimary,
    backgroundWidthPrimary,
    margin,
    padding,
    title,
  } = options || {};

  return (
    <div
      className={`relative w-full max-lg:px-3 h-max
        ${backgroundColorPrimary ? "py-6" : "py-3"}
        ${margin} ${padding} `}
    >
      <PatternBackground
        name={backgroundPatternNamePrimary as BackgroundPatternName}
        backgroundColor={getThemeColorValueByName(backgroundColorPrimary)}
        patternColor={getThemeColorValueByName(backgroundPatternColorPrimary)}
        patternSize={backgroundPatternSizePrimary || 32}
        screenWidth={backgroundWidthPrimary === "w-screen" ? true : false}
        brightness={backgroundBrightnessPrimary || undefined}
      />
      {children}

      {title && backgroundColorPrimary && <div className="pb-3"></div>}
    </div>
  );
};

export default Container;

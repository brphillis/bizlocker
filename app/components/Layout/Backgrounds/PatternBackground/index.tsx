import type { CSSProperties } from "react";

type Props = {
  name?: BackgroundPatternName;
  patternColor?: string;
  backgroundColor?: string;
  patternOpacity?: number;
  patternSize?: number;
  screenWidth?: boolean;
  brightness?: number;
  displayStyle?: string | null;
};

const PatternBackground = ({
  name,
  patternColor,
  backgroundColor,
  patternOpacity,
  patternSize = 50,
  screenWidth,
  brightness,
  displayStyle,
}: Props) => {
  const extendStyle: Record<string, CSSProperties> = {
    wavy: {
      opacity: patternOpacity || "0.5",
      backgroundColor: backgroundColor,
      backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${backgroundColor} ${
        patternSize + "px"
      }), repeating-linear-gradient(${patternColor + "8C"}, ${patternColor})`,
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      top: 0,
      height: "100%",
      width: screenWidth ? "100vw" : "100%",
      filter: brightness ? `brightness(${brightness})` : "unset",
    },
    isometric: {
      opacity: patternOpacity || "0.4",
      backgroundColor: backgroundColor,
      backgroundImage: `linear-gradient(30deg, ${patternColor} 12%, transparent 12.5%, transparent 87%, ${patternColor} 87.5%, ${patternColor}), linear-gradient(150deg, ${patternColor} 12%, transparent 12.5%, transparent 87%, ${patternColor} 87.5%, ${patternColor}), linear-gradient(30deg, ${patternColor} 12%, transparent 12.5%, transparent 87%, ${patternColor} 87.5%, ${patternColor}), linear-gradient(150deg, ${patternColor} 12%, transparent 12.5%, transparent 87%, ${patternColor} 87.5%, ${patternColor}), linear-gradient(60deg, ${
        patternColor + "C4"
      } 25%, transparent 25.5%, transparent 75%, ${patternColor + "C4"} 75%, ${
        patternColor + "C4"
      }), linear-gradient(60deg, ${
        patternColor + "C4"
      } 25%, transparent 25.5%, transparent 75%, ${patternColor + "C4"} 75%, ${
        patternColor + "C4"
      })`,
      backgroundSize: `${patternSize + "px"} calc(${
        patternSize + "px"
      } * 1.75)`,
      backgroundPosition: `0 0, 0 0, ${patternSize / 2 + "px"} calc(${
        patternSize + "px"
      } * .875), ${patternSize / 2 + "px"} calc(${
        patternSize + "px"
      } * .875), 0 0, ${patternSize / 2 + "px"} calc(${
        patternSize + "px"
      } * .875)`,
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      top: 0,
      height: "100%",
      width: screenWidth ? "100vw" : "100%",
      filter: brightness ? `brightness(${brightness})` : "unset",
    },
  };

  const noPatternStyle: CSSProperties = {
    backgroundColor: backgroundColor,
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    top: 0,
    height: "100%",
    width: screenWidth ? "100vw" : "100%",
    filter: brightness ? `brightness(${brightness})` : "unset",
  };

  const selectedStyle = name ? extendStyle[name] : noPatternStyle;

  return (
    <div
      style={selectedStyle}
      className={`brightness-[0.3] ${displayStyle}`}
    ></div>
  );
};

export default PatternBackground;

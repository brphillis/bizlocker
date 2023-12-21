import { searchObjectByKey } from "~/helpers/objectHelpers";
import colorPrefixList from "../../theme/themeColorPrefixList";
import themeColors from "../../theme/theme";

export const getThemeColorNames = (): string[] => {
  return Object.keys(themeColors);
};

export const getThemeColorValues = (): string[] => {
  return Object.values(themeColors);
};

export const getThemeColorValueByName = (colorName?: string | null): string => {
  if (colorName) {
    let currentColorName = colorName;

    if (currentColorName.includes("/")) {
      currentColorName = currentColorName.split("/")[0];
    }

    colorPrefixList.forEach((prefix: string) => {
      if (currentColorName.startsWith(prefix)) {
        currentColorName = currentColorName.slice(prefix.length);
      }
    });

    const foundVal = searchObjectByKey(themeColors, currentColorName) as string;

    if (foundVal) {
      return foundVal;
    } else return "unset";
  } else return "unset";
};

export const returnOtherColorPrefix = (
  initialString: string,
  newPrefix: "bg-" | "text-" | "border-" | "outline-" | "decoration-"
): string => {
  let formattedString = initialString;

  if (initialString.startsWith(newPrefix)) {
    return initialString;
  }

  let hasExistingPrefix = false;

  colorPrefixList.forEach((prefix: string) => {
    if (initialString.startsWith(prefix)) {
      formattedString = formattedString.slice(prefix.length);
      hasExistingPrefix = true;
    }
  });

  if (hasExistingPrefix) {
    return newPrefix + formattedString;
  } else {
    return newPrefix + initialString;
  }
};

export const removeColorPrefix = (initialString: string) => {
  let formattedString = initialString;

  let hasExistingPrefix = false;

  colorPrefixList.forEach((prefix: string) => {
    if (initialString.startsWith(prefix)) {
      formattedString = formattedString.slice(prefix.length);
      hasExistingPrefix = true;
    }
  });

  if (hasExistingPrefix) {
    return formattedString;
  } else {
    return initialString;
  }
};

export const generateProductColor = (
  colorName?: string | null
): string | null => {
  const lowerCaseColorName = colorName?.toLowerCase();

  if (themeColors[`brand-${lowerCaseColorName}` as keyof typeof themeColors]) {
    return `brand-${lowerCaseColorName}`;
  } else {
    console.error(`Color not found for ${colorName}`);
    return null;
  }
};

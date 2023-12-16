import { searchObjectByKey } from "~/helpers/objectHelpers";

const themeColors = require("../../theme");

export const getThemeColorNames = (): string[] => {
  return Object.keys(themeColors);
};

export const getThemeColorValues = (): string[] => {
  return Object.values(themeColors);
};

export const getThemeColorValueByName = (colorName: string): string => {
  return searchObjectByKey(themeColors, colorName) as string;
};

export const generateProductColor = (
  colorName?: string | null
): string | null => {
  const lowerCaseColorName = colorName?.toLowerCase();

  if (themeColors[`brand-${lowerCaseColorName}`]) {
    return `brand-${lowerCaseColorName}`;
  } else {
    console.error(`Color not found for ${colorName}`);
    return null;
  }
};

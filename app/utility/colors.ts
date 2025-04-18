import { colorPrefixList } from "../../theme/themeColorPrefixList.mjs";
import { themeColors } from "../../theme/theme.mjs";
import { searchObjectByKey } from "~/helpers/objectHelpers";

export const getThemeColorNames = (): string[] => {
  return Object.keys(themeColors);
};

export const getThemeColorValues = (): string[] => {
  return Object.values(themeColors);
};

export const getThemeColorValueByName = (colorName?: string | null): string => {
  if (colorName) {
    let currentColorName = colorName;
    let currentColorOpacityHexCode;

    if (currentColorName.includes("/")) {
      const splitName = currentColorName.split("/");
      currentColorName = splitName[0];
      currentColorOpacityHexCode = getHexTransparencyCode(Number(splitName[1]));
    }

    colorPrefixList.forEach((prefix: string) => {
      if (currentColorName.startsWith(prefix)) {
        currentColorName = currentColorName.slice(prefix.length);
      }
    });

    let foundVal = searchObjectByKey(themeColors, currentColorName) as string;

    if (currentColorOpacityHexCode) {
      foundVal += currentColorOpacityHexCode;
    }

    if (foundVal) {
      return foundVal;
    } else return "unset";
  } else return "unset";
};

export const returnOtherColorPrefix = (
  initialString: string,
  newPrefix: "bg-" | "text-" | "border-" | "outline-" | "decoration-",
): string => {
  let formattedString = initialString;

  if (formattedString.includes("/")) {
    formattedString = formattedString.split("/")[0];
  }

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
  colorName?: string | null,
): string | null => {
  const lowerCaseColorName = colorName?.toLowerCase();

  // Check for single-word color names
  if (themeColors[`brand-${lowerCaseColorName}` as keyof typeof themeColors]) {
    return `brand-${lowerCaseColorName}`;
  }

  // Check for two-word color names
  const colorWords = lowerCaseColorName?.split(" ");

  if (colorWords && colorWords.length === 2) {
    const [firstWord, secondWord] = colorWords;
    const twoWordColorName = `${firstWord}-${secondWord}`;
    if (themeColors[`brand-${twoWordColorName}` as keyof typeof themeColors]) {
      return `brand-${twoWordColorName}`;
    }
  }

  //check for color variant ie: slate BLUE, dark RED, army GREEN
  if (colorWords && colorWords.length === 2) {
    if (themeColors[`brand-${colorWords[1]}` as keyof typeof themeColors]) {
      return `brand-${colorWords[1]}`;
    }
  }

  return null;
};

export const getHexTransparencyCode = (percent: number): string => {
  const roundedPercent: number = Math.round(percent);

  const codeMap: { [key: number]: string } = {
    100: "FF",
    99: "FC",
    98: "FA",
    97: "F7",
    96: "F5",
    95: "F2",
    94: "F0",
    93: "ED",
    92: "EB",
    91: "E8",
    90: "E6",
    89: "E3",
    88: "E0",
    87: "DE",
    86: "DB",
    85: "D9",
    84: "D6",
    83: "D4",
    82: "D1",
    81: "CF",
    80: "CC",
    79: "C9",
    78: "C7",
    77: "C4",
    76: "C2",
    75: "BF",
    74: "BD",
    73: "BA",
    72: "B8",
    71: "B5",
    70: "B3",
    69: "B0",
    68: "AD",
    67: "AB",
    66: "A8",
    65: "A6",
    64: "A3",
    63: "A1",
    62: "9E",
    61: "9C",
    60: "99",
    59: "96",
    58: "94",
    57: "91",
    56: "8F",
    55: "8C",
    54: "8A",
    53: "87",
    52: "85",
    51: "82",
    50: "80",
    49: "7D",
    48: "7A",
    47: "78",
    46: "75",
    45: "73",
    44: "70",
    43: "6E",
    42: "6B",
    41: "69",
    40: "66",
    39: "63",
    38: "61",
    37: "5E",
    36: "5C",
    35: "59",
    34: "57",
    33: "54",
    32: "52",
    31: "4F",
    30: "4D",
    29: "4A",
    28: "47",
    27: "45",
    26: "42",
    25: "40",
    24: "3D",
    23: "3B",
    22: "38",
    21: "36",
    20: "33",
    19: "30",
    18: "2E",
    17: "2B",
    16: "29",
    15: "26",
    14: "24",
    13: "21",
    12: "1F",
    11: "1C",
    10: "1A",
    9: "17",
    8: "14",
    7: "12",
    6: "0F",
    5: "0D",
    4: "0A",
    3: "08",
    2: "05",
    1: "03",
    0: "00",
  };

  return codeMap[roundedPercent] || "Invalid Percentage";
};

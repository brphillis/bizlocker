export const generateColor = (colorName: string) => {
  switch (colorName) {
    case "RED":
      return "#FF3A20";
    case "BLUE":
      return "#3B82F6";
    case "GREEN":
      return "#44AF69 ";
    case "YELLOW":
      return "#F7C548";
    case "ORANGE":
      return "#FFA500";
    case "PURPLE":
      return "#694873";
    case "PINK":
      return "#F7567C";
    case "BLACK":
      return "#232227";
    case "WHITE":
      return "#F0F0F0";
    case "GRAY":
      return "#808080";
    case "BROWN":
      return "#A98743";
    case "SILVER":
      return "#D7D9D7";
    case "GOLD":
      return "#FFD700";
    case "NAVY":
      return "#000080";
    case "TEAL":
      return "#008080";
    case "MAROON":
      return "#800000";
    case "LIME":
      return "#61E786";
    case "OLIVE":
      return "#808000";
    case "AQUA":
      return "#00FFFF";
    case "INDIGO":
      return "#4B0082";
    case "TRANSPARENT":
      return "rgba(0, 0, 0, 0)";
    case "TRANSPARENTSM":
      return "rgba(0, 0, 0, 0.25)";
    case "TRANSPARENTMD":
      return "rgba(0, 0, 0, 0.50)";
    case "TRANSPARENTLG":
      return "rgba(0, 0, 0, 0.75)";

    default:
      return "rgba(0, 0, 0, 0)";
  }
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

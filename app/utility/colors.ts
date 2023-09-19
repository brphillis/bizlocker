export const generateColor = (colorName: string) => {
  switch (colorName) {
    case "RED":
      return "#FF0000";
    case "BLUE":
      return "#3B82F6";
    case "GREEN":
      return "#008000";
    case "YELLOW":
      return "#FFFF00";
    case "ORANGE":
      return "#FFA500";
    case "PURPLE":
      return "#800080";
    case "PINK":
      return "#FFC0CB";
    case "BLACK":
      return "#232227";
    case "WHITE":
      return "#F0F0F0";
    case "GRAY":
      return "#808080";
    case "BROWN":
      return "#A52A2A";
    case "SILVER":
      return "#C0C0C0";
    case "GOLD":
      return "#FFD700";
    case "NAVY":
      return "#000080";
    case "TEAL":
      return "#008080";
    case "MAROON":
      return "#800000";
    case "LIME":
      return "#00FF00";
    case "OLIVE":
      return "#808000";
    case "AQUA":
      return "#00FFFF";
    case "INDIGO":
      return "#4B0082";

    default:
      return "#FFFFFF";
  }
};

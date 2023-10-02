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

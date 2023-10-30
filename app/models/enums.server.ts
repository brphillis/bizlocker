import { Color } from "@prisma/client";

export const getAvailableColors = async () => {
  const availableColors = Object.values(Color);

  // Sort the colors alphabetically
  availableColors.sort((a, b) => a.localeCompare(b));

  return availableColors;
};

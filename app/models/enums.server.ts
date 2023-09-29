import { Color, Size } from "@prisma/client";

export const getAvailableColors = async () => {
  const availableColors = Object.values(Color);

  // Sort the colors alphabetically
  availableColors.sort((a, b) => a.localeCompare(b));

  return availableColors;
};

export const getAvailableSizes = async () => {
  const availableSizes = Object.values(Size);
  return availableSizes;
};

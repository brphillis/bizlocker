import { capitalizeWords } from "~/helpers/stringHelpers";
import { getThemeColorNames } from "~/utility/colors";

export const colorSelection = getThemeColorNames().map((e) => {
  return { id: e, name: capitalizeWords(e.replace("-", " ")) };
});

export const backgroundColorSelection = getThemeColorNames().map((e) => {
  return { id: "bg-" + e, name: capitalizeWords(e.replace("-", " ")) };
});

export const textColorSelection = getThemeColorNames().map((e) => {
  return { id: "text-" + e, name: capitalizeWords(e.replace("-", " ")) };
});

export const borderColorSelection = getThemeColorNames().map((e) => {
  return { id: "border-" + e, name: capitalizeWords(e.replace("-", " ")) };
});

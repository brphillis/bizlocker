const fs = require("fs");
const themeColors = require("./theme");
const colorPrefixList = require("./themeColorPrefixList");

let combinedContent = "";

// Build an object with all opacity values added onto each color
const opacitySteps = Array.from({ length: 10 }, (_, index) => (index + 1) * 10);

const themeColorsWithOpacity = Object.keys(themeColors).flatMap((key) => {
  const colorWithNumericValues = opacitySteps.map((value) => `${key}/${value}`);
  return [key, ...colorWithNumericValues];
});

// Build Theme Colors
for (const prefix of colorPrefixList) {
  const currentType = themeColorsWithOpacity.map((key) => `${prefix}${key}`);

  const content = `export const ${
    prefix.replace("-", "_") + "Colorlist"
  } = ${JSON.stringify(currentType, null, 2)};\n`;

  combinedContent += content;
}

// Specify the file path
const filePath = "./app/utility/build/tailwindtypes.ts";

if (combinedContent) {
  // Write the combined content to the file
  fs.writeFileSync(filePath, combinedContent);
}

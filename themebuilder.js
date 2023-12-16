const fs = require("fs");
const themeColors = require("./theme");

// BACKGROUND TYPES
const tailwindTypes_BG = Object.keys(themeColors).map((key) => `bg-${key}`);
const fileContent_BG = `export const bgColors = ${JSON.stringify(
  tailwindTypes_BG,
  null,
  2
)};\n`;

// TEXT TYPES
const tailwindTypes_TEXT = Object.keys(themeColors).map((key) => `text-${key}`);
const fileContent_TEXT = `export const textColors = ${JSON.stringify(
  tailwindTypes_TEXT,
  null,
  2
)};\n`;

// BORDER TYPES
const tailwindTypes_BORDER = Object.keys(themeColors).map(
  (key) => `border-${key}`
);
const fileContent_BORDER = `export const borderColors = ${JSON.stringify(
  tailwindTypes_BORDER,
  null,
  2
)};\n`;

// Combine all content
const combinedContent = fileContent_BG + fileContent_TEXT + fileContent_BORDER;

// Specify the file path
const filePath = "./app/utility/build/tailwindtypes.ts";

// Write the combined content to the file
fs.writeFileSync(filePath, combinedContent);

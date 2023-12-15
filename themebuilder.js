const fs = require("fs");
const themeColors = require("./theme");

//BACKGROUND TYPES
const tailwindTypes_BG = Object.keys(themeColors).map((key) => `bg-${key}`);
const fileContent_BG = `const bgColors = ${JSON.stringify(
  tailwindTypes_BG,
  null,
  2
)};\n`;

const filePath_BG = "./app/utility/build/tailwindBG_types.js";
fs.writeFileSync(filePath_BG, fileContent_BG);

//TEXT TYPES
const tailwindTypes_TEXT = Object.keys(themeColors).map((key) => `text-${key}`);
const fileContent_TEXT = `const textColors = ${JSON.stringify(
  tailwindTypes_TEXT,
  null,
  2
)};\n`;

const filePath_TEXT = "./app/utility/build/tailwindTEXT_types.js";
fs.writeFileSync(filePath_TEXT, fileContent_TEXT);

//BORDER  TYPES
const tailwindTypes_BORDER = Object.keys(themeColors).map(
  (key) => `border-${key}`
);
const fileContent_BORDER = `const textColors = ${JSON.stringify(
  tailwindTypes_BORDER,
  null,
  2
)};\n`;

const filePath_BORDER = "./app/utility/build/tailwindBORDER_types.js";
fs.writeFileSync(filePath_BORDER, fileContent_BORDER);

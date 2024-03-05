import * as fs from "fs";
import * as path from "path";

// Define the content to be written to the file
const content = `
export const CLIENT_ENV = \`PRODUCTION\`;\n
export const CURRENT_BUCKET = \`${process.env.AWS_BUCKET}\`;\n
export const SOLANA_WALLET = \`${process.env.SOLANA_WALLET}\`;\n
`;

console.log("BUILDING ... RUNNING CLIENT ENV SCRIPT - PRODUCTION");

console.log("BUILDING ... CLIENT ENV VALUES", content);

// Specify the file path
const filePath = "./app/build/clientEnv.ts";

// Ensure the directory exists
const directory = path.dirname(filePath);
if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

// Write the content to the file
fs.writeFileSync(filePath, content);

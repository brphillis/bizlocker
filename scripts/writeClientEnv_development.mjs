import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Define the content to be written to the file
const content = `
export const CURRENT_BUCKET = \`${process.env.AWS_BUCKET + "-dev"}\`;\n
`;

// Specify the file path
const filePath = "./app/build/clientenv.ts";

// Ensure the directory exists
const directory = path.dirname(filePath);
if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

// Write the content to the file
fs.writeFileSync(filePath, content);

import { Client, Environment } from "square";

export const squareClient = new Client({
  environment: Environment.Sandbox, // Use Environment.Production when you're ready to go live
  accessToken: process.env.SQUARE_ACCESS,
});

import { type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "CLUTCH - clothing." }];

export const adminHomeLoader = async () => {
  return null;
};

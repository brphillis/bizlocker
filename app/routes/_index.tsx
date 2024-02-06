import { type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "CLUTCH - clothing." }];

export const loader = async () => {
  return null;
};

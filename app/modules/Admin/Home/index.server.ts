import { Params } from "@remix-run/react";
import { type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "CLUTCH - clothing." }];

export const adminHomeLoader = async (
  request: Request,
  params: Params<string>,
) => {
  return null;
};

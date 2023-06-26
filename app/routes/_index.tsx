import { type V2_MetaFunction, redirect } from "@remix-run/node";

export const meta: V2_MetaFunction = () => [{ title: "CLUTCH - clothing." }];

export const loader = async () => redirect("/home");

import { type MetaFunction, redirect } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "CLUTCH - clothing." }];

export const loader = async () => redirect("/home");

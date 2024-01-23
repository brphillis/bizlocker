import { logout } from "~/session.server";
import { redirect } from "@remix-run/node";

export const logoutAction = async (request: Request) => logout(request);

export const logoutLoader = async () => redirect("/");

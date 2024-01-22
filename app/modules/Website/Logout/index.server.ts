import { Params } from "@remix-run/react";
import { logout } from "~/session.server";
import { redirect } from "@remix-run/node";

export const logoutAction = async (request: Request, params: Params<string>) =>
  logout(request);

export const logoutLoader = async (request: Request, params: Params<string>) =>
  redirect("/");

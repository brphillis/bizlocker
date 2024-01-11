import type { Params } from "@remix-run/react";
import { json } from "@remix-run/node";
import { searchTeams } from "~/models/teams.server";

export const teamSearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const { teams, totalPages } = await searchTeams(undefined, url);

  return json({
    teams,
    totalPages,
  });
};

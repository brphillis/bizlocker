import { json } from "@remix-run/node";
import { searchTeams } from "~/models/Teams/index.server";

export const teamSearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const { teams, totalPages } = await searchTeams(undefined, url);

  return json({
    teams,
    totalPages,
  });
};

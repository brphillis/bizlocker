import type { Params } from "@remix-run/react";
import { json } from "@remix-run/node";
import { searchUsers } from "~/models/users.server";

export const userSearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const searchQuery = {
    firstName: url.searchParams.get("firstName") as string,
    lastName: url.searchParams.get("lastName") as string,
    email: url.searchParams.get("email") as string,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: 10,
  };

  const { users, totalPages } = await searchUsers(searchQuery, true);

  return json({ users, totalPages });
};

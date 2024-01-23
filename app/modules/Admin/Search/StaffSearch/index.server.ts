import { json } from "@remix-run/node";
import { searchStaff } from "~/models/Staff/index.server";

export const staffSearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const searchQuery = {
    firstName: url.searchParams.get("firstName") as string,
    lastName: url.searchParams.get("lastName") as string,
    email: url.searchParams.get("email") as string,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: 10,
  };

  const { staff, totalPages } = await searchStaff(searchQuery, true);

  return json({ staff, totalPages });
};

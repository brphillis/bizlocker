import { json } from "@remix-run/node";
import { searchDepartments } from "~/models/Departments/index.server";

export const departmentSearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const searchQuery = {
    name: url.searchParams.get("name")?.toString() || undefined,
    sortBy: url.searchParams.get("sortBy")?.toString() || undefined,
    sortOrder: url.searchParams.get("sortOrder")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("perPage")) || 10,
  };

  const { departments, totalPages } = await searchDepartments(searchQuery);

  return json({
    totalPages,
    departments,
  });
};

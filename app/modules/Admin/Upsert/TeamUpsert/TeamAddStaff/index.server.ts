import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { getStores } from "~/models/Stores/index.server";
import { searchStaff } from "~/models/Staff/index.server";
import { addTeamMemberToTeam } from "~/models/Teams/index.server";
import type { PageNotification } from "~/hooks/PageNotification";

export const teamAddStaffLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const contentType = params.contentType;

  if (!contentType || contentType !== "team") {
    throw new Response(null, {
      status: 404,
      statusText: "Page Not Found",
    });
  }

  const url = new URL(request.url);

  const searchQuery = {
    firstName: url.searchParams.get("firstName") as string,
    lastName: url.searchParams.get("lastName") as string,
    email: url.searchParams.get("email") as string,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: 10,
  };

  const { staff, totalPages } = await searchStaff(searchQuery, true);

  const stores = await getStores();
  const teamId = url.searchParams.get("teamId");

  return json({ staff, totalPages, stores, teamId });
};

export const teamAddStaffAction = async (request: Request) => {
  const form = Object.fromEntries(await request.formData());
  let notification: PageNotification;

  switch (form._action) {
    case "addUser": {
      const { staffId, teamId } = form;

      try {
        await addTeamMemberToTeam(staffId as string, teamId as string);

        notification = {
          type: "success",
          message: "User Added",
        };
        return json({ success: true, notification });
      } catch (err) {
        notification = {
          type: "error",
          message: "Error Adding User",
        };
        return json({ success: false, notification });
      }
    }
  }
};

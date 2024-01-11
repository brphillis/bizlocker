import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import type { PageNotification } from "~/hooks/PageNotification";
import { getStores } from "~/models/stores.server";
import {
  getTeam,
  removeTeamMemberFromTeam,
  type TeamWithStaff,
  upsertTeam,
} from "~/models/teams.server";
import { validateForm } from "~/utility/validate";

const validateOptions = {
  name: true,
};

export const teamUpsertLoader = async (
  request: Request,
  params: Params<string>,
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("teamId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Campaign Not Found",
    });
  }

  const team = id === "add" ? ({} as TeamWithStaff) : await getTeam(id);

  if (!team) {
    throw new Response(null, {
      status: 404,
      statusText: "Team Not Found",
    });
  }

  const stores = await getStores();

  if (!stores) {
    throw new Response(null, {
      status: 404,
      statusText: "Stores Not Found",
    });
  }

  return json({ team, stores });
};

export const teamUpsertAction = async (
  request: Request,
  params: Params<string>,
) => {
  let notification: PageNotification;

  let { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");
  let id = teamId === "add" || !teamId ? undefined : teamId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const { name, location, isActive } = formEntries;

  switch (formEntries._action) {
    case "upsert":
      if (formErrors) {
        return { serverValidationErrors: formErrors };
      }

      const teamData = {
        id: id as string,
        name: name as string,
        store: location as string,
        isActive: isActive ? true : false,
      };

      await upsertTeam(teamData);

      notification = {
        type: "success",
        message: `Team ${id === "add" ? "Added" : "Updated"}.`,
      };

      return { success: true, notification };

    case "removeUser":
      const { staffId, teamId } = formEntries;

      try {
        await removeTeamMemberFromTeam(staffId as string, teamId as string);

        notification = {
          type: "warning",
          message: "User Removed",
        };

        return { success: true, notification };
      } catch (err) {
        notification = {
          type: "error",
          message: "Error Removing User",
        };

        return { success: false, notification };
      }
  }
};

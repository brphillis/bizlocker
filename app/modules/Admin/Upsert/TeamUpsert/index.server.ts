import { json } from "@remix-run/node";
import { validateForm } from "~/utility/validate";
import { TeamWithStaff } from "~/models/Teams/types";
import { getStores } from "~/models/Stores/index.server";
import { PageNotification } from "~/hooks/PageNotification";
import {
  getTeam,
  removeTeamMemberFromTeam,
  upsertTeam,
} from "~/models/Teams/index.server";

const validateOptions = {
  name: true,
};

export const teamUpsertLoader = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("teamId");

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

export const teamUpsertAction = async (request: Request) => {
  let notification: PageNotification;

  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");
  const id = teamId === "add" || !teamId ? undefined : teamId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const { name, location, isActive } = formEntries;

  switch (formEntries._action) {
    case "upsert": {
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
    }

    case "removeUser": {
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
  }
};

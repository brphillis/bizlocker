import { useEffect, useState } from "react";
import { tokenAuth } from "~/auth.server";
import { HiTrash } from "react-icons/hi2";
import { validateForm } from "~/utility/validate";
import { getStores } from "~/models/stores.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import { IoArrowForwardCircle } from "react-icons/io5";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import { placeholderAvatar } from "~/utility/placeholderAvatar";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { ActionAlert } from "~/components/Notifications/Alerts";
import type { StaffWithDetails } from "~/models/auth/staff.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import {
  json,
  redirect,
  type ActionArgs,
  type LoaderArgs,
} from "@remix-run/node";
import {
  getTeam,
  removeTeamMemberFromTeam,
  upsertTeam,
} from "~/models/teams.server";
import {
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/login");
  }

  const id = params?.id;

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Campaign Not Found",
    });
  }

  let team = null;

  if (id !== "add") {
    team = await getTeam(id);
  }

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

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/login");
  }
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());

  switch (form._action) {
    case "upsert":
      const { name, location, isActive } = form;
      const validate = {
        name: true,
      };

      const validationErrors = validateForm(form, validate);
      if (validationErrors) {
        return { validationErrors };
      }

      const teamData = {
        id: id as string,
        name: name as string,
        store: location as string,
        isActive: isActive ? true : false,
      };

      await upsertTeam(teamData);

      return { success: true };

    case "removeUser":
      const { staffId, teamId } = form;

      return await removeTeamMemberFromTeam(
        staffId as string,
        teamId as string
      );
  }
};

const ModifyTeam = () => {
  const navigate = useNavigate();
  const submit = useSubmit();
  const { team, stores } = useLoaderData<typeof loader>();
  const { validationErrors, success } = useActionData() as ActionReturnTypes;

  const mode = team ? "edit" : "add";

  const [loading, setLoading] = useState<boolean>(false);

  const handleRemoveUserFromTeam = (
    staffId: string,
    firstName?: string | null,
    lastName?: string | null
  ) => {
    const hasFullName = firstName && lastName;
    ActionAlert(
      "Confirm",
      `Remove ${hasFullName ? firstName + " " + lastName : "User"} From Team?`,
      () => {
        const formData = new FormData();
        formData.set("_action", "removeUser");
        formData.set("staffId", staffId);
        formData.set("teamId", team?.id.toString());
        submit(formData, { method: "POST" });
      }
    );
  };

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
  }, [success, navigate]);

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="scrollbar-hide relative w-[500px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
          valueToChange={team}
          type="Team"
          hasIsActive={true}
          hasDelete={false}
        />
        <div className="flex flex-col gap-6">
          <BasicInput
            name="name"
            label="Team Name"
            placeholder="Name"
            type="text"
            customWidth="w-full"
            defaultValue={team?.name || undefined}
            validationErrors={validationErrors}
          />

          <BasicSelect
            label="Location"
            name="location"
            customWidth="w-full"
            placeholder="Select a Location"
            selections={stores as unknown as SelectValue[]}
            defaultValue={team.storeId?.toString() || undefined}
          />

          {mode === "edit" && (
            <div className="mx-auto w-full">
              <div>
                <div className="mb-3 ml-[6px] text-[0.875rem]">
                  {`Team Members ( ${team?.staff?.length || 0} )`}
                </div>
              </div>
              <table className="table">
                <tbody>
                  {team?.staff?.map(
                    (
                      { id, userDetails, avatar, jobTitle }: StaffWithDetails,
                      index: number
                    ) => {
                      const { firstName, lastName } = userDetails!;
                      return (
                        <tr
                          key={"teamMemberTableRow_" + index}
                          className="cursor-pointer rounded-sm transition-colors duration-300 hover:bg-base-100"
                        >
                          <th>{index + 1}</th>

                          <td>
                            <div className="flex items-center space-x-3">
                              <div className="avatar">
                                <div className="mask mask-circle h-12 w-12">
                                  <img
                                    src={avatar?.href || placeholderAvatar.href}
                                    alt="staff_avatar"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">
                                  {firstName} {lastName}
                                </div>
                                <div className="text-sm opacity-50">
                                  {jobTitle}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <IoArrowForwardCircle
                              size={24}
                              className="cursor-pointer rounded-full bg-primary p-[0.3rem] text-primary-content transition-colors duration-300 hover:bg-primary-focus"
                              onClick={() => navigate(`/admin/staff/${id}`)}
                            />
                          </td>

                          <td>
                            <HiTrash
                              size={24}
                              className="cursor-pointer rounded-full bg-error p-[0.3rem] text-primary-content transition-colors duration-300 hover:bg-red-500"
                              onClick={() =>
                                handleRemoveUserFromTeam(
                                  id,
                                  firstName,
                                  lastName
                                )
                              }
                            />
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>

              <div className="mt-3 flex w-full items-center justify-center">
                <div
                  className="btn btn-primary btn-md w-max !rounded-sm"
                  onClick={() => navigate("add-staff")}
                >
                  Add +
                </div>
              </div>
            </div>
          )}
        </div>

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          validationErrors={validationErrors}
        />
      </Form>
      <Outlet />
    </DarkOverlay>
  );
};

export default ModifyTeam;

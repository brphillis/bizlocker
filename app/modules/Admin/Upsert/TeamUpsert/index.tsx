import { type FormEvent, useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { HiTrash } from "react-icons/hi2";
import { getStores } from "~/models/stores.server";
import { getFormData } from "~/helpers/formHelpers";
import { IoArrowForwardCircle } from "react-icons/io5";
import { isEmptyObject } from "~/helpers/objectHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import WindowTitleBar from "~/components/Layout/TitleBars/WindowTitleBar";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { placeholderAvatar } from "~/utility/placeholderAvatar";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { ActionAlert } from "~/components/Notifications/Alerts";
import type { StaffWithDetails } from "~/models/staff.server";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import {
  getTeam,
  removeTeamMemberFromTeam,
  type TeamWithStaff,
  upsertTeam,
} from "~/models/teams.server";
import {
  Form,
  Outlet,
  type Params,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
} from "@remix-run/react";

const validateOptions = {
  name: true,
};

export const teamUpsertLoader = async (
  request: Request,
  params: Params<string>
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
  params: Params<string>
) => {
  let notification: PageNotification;

  let { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");
  let id = teamId === "add" || !teamId ? undefined : teamId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions
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

type Props = {
  offRouteModule?: boolean;
};

const TeamUpsert = ({ offRouteModule }: Props) => {
  const { team, stores } = useLoaderData<typeof teamUpsertLoader>();
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  let submit = useSubmit();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("teamId");
  useNotification(notification);

  const mode = !isEmptyObject(team) ? "edit" : "add";

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleRemoveUserFromTeam = (
    staffId: number,
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
        formData.set("staffId", staffId.toString());
        formData.set("teamId", team?.id.toString());
        submit(formData, { method: "POST" });
      }
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const form = getFormData(event);
    event.preventDefault();

    const { formErrors } = validateForm(new FormData(form), validateOptions);
    if (formErrors) {
      setClientValidationErrors(formErrors);
      setLoading(false);
      return;
    }

    const submitFunction = () => {
      submit(form, {
        method: "POST",
        action: `/admin/upsert/team?teamId=${teamId}`,
        navigate: offRouteModule ? false : true,
      });
    };

    submitFunction();

    if (offRouteModule) {
      navigate(-1);
    }
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
        onSubmit={handleSubmit}
        className="scrollbar-hide relative w-[500px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <WindowTitleBar
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
            validationErrors={serverValidationErrors || clientValidationErrors}
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
                              className="cursor-pointer rounded-full bg-primary p-[0.3rem] text-primary-content transition-colors duration-300 hover:bg-primary-dark"
                              onClick={() =>
                                navigate(`/admin/upsert/staff?teamId=${id}`)
                              }
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
                  onClick={() => navigate(`addStaff?teamId=${teamId}`)}
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
          validationErrors={serverValidationErrors || clientValidationErrors}
        />
      </Form>
      <Outlet />
    </DarkOverlay>
  );
};

export default TeamUpsert;

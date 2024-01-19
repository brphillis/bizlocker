import { type FormEvent, useEffect, useState } from "react";
import { HiTrash } from "react-icons/hi2";
import { getFormData } from "~/helpers/formHelpers";
import { IoArrowForwardCircle } from "react-icons/io5";
import { isEmptyObject } from "~/helpers/objectHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { placeholderAvatar } from "~/utility/placeholderAvatar";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { ActionAlert } from "~/components/Notifications/Alerts";
import type { StaffWithDetails } from "~/models/staff.server";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification from "~/hooks/PageNotification";
import {
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
  useParams,
} from "@remix-run/react";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";
import type { teamUpsertLoader } from "./index.server";

const validateOptions = {
  name: true,
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
  const { contentType } = useParams();
  useNotification(notification);

  const mode = !isEmptyObject(team) ? "edit" : "add";

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleRemoveUserFromTeam = (
    staffId: number,
    firstName?: string | null,
    lastName?: string | null,
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
      },
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let form = getFormData(event);
    event.preventDefault();

    form = handleWindowedFormData(form);

    const { formErrors } = validateForm(new FormData(form), validateOptions);
    if (formErrors) {
      setClientValidationErrors(formErrors);
      setLoading(false);
      return;
    }

    submit(form, {
      method: "POST",
      action: `/admin/upsert/${contentType}?contentId=${teamId}`,
      navigate: offRouteModule ? false : true,
    });

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
      <WindowContainer
        hasIsActive={true}
        isActive={team?.isActive}
        hasMode={true}
        title="Team"
        children={
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[500px] max-w-full overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              <BasicInput
                name="name"
                label="Team Name"
                placeholder="Name"
                type="text"
                extendContainerStyle="w-full"
                defaultValue={team?.name || undefined}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicSelect
                label="Location"
                name="location"
                extendContainerStyle="w-full"
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
                          {
                            id,
                            userDetails,
                            avatar,
                            jobTitle,
                          }: StaffWithDetails,
                          index: number,
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
                                        src={
                                          avatar?.href || placeholderAvatar.href
                                        }
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
                                      lastName,
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          );
                        },
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
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />
          </Form>
        }
      />

      <Outlet />
    </DarkOverlay>
  );
};

export default TeamUpsert;

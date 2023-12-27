import { useEffect, useState } from "react";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { IoAdd } from "react-icons/io5";
import { tokenAuth } from "~/auth.server";
import Pagination from "~/components/Pagination";
import { getStores } from "~/models/stores.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import { addTeamMemberToTeam } from "~/models/teams.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import { placeholderAvatar } from "~/utility/placeholderAvatar";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { ActionAlert } from "~/components/Notifications/Alerts";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { searchStaff, type StaffWithDetails } from "~/models/auth/staff.server";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/login");
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
  const teamId = params?.id;

  return json({ staff, totalPages, stores, teamId });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/login");
  }

  const form = Object.fromEntries(await request.formData());

  switch (form._action) {
    case "addUser":
      const { staffId, teamId } = form;

      const res = await addTeamMemberToTeam(
        staffId as string,
        teamId as string
      );

      return json({ success: res ? true : false });
  }
};

const ModifyTeam = () => {
  const { staff, totalPages, stores, teamId } = useLoaderData<typeof loader>();

  const { success } = (useActionData() as ActionReturnTypes) || {};
  const navigate = useNavigate();
  const submit = useSubmit();

  const [loading, setLoading] = useState<boolean>(false);

  const handleAddUserToTeam = (
    staffId: string,
    firstName?: string | null,
    lastName?: string | null
  ) => {
    const hasFullName = firstName && lastName;

    if (teamId)
      ActionAlert(
        "Confirm",
        `Add ${hasFullName ? firstName + " " + lastName : "User"} To Team?`,
        () => {
          const formData = new FormData();
          formData.set("_action", "addUser");
          formData.set("staffId", staffId);
          formData.set("teamId", teamId.toString());
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
        method="GET"
        className="scrollbar-hide relative w-[500px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader type="Team" hasIsActive={false} hasDelete={false} />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <div className="flex justify-between gap-3">
              <BasicInput
                name="firstName"
                label="First Name"
                placeholder="Name"
                type="text"
              />

              <BasicInput
                name="lastName"
                label="Last Name"
                placeholder="Name"
                type="text"
              />
            </div>
            <div>
              <BasicSelect
                label="Location"
                name="location"
                customWidth="w-full"
                placeholder="Select a Location"
                selections={stores as unknown as SelectValue[]}
              />
            </div>

            <div className="flex flex-row justify-end sm:justify-start">
              <button
                type="submit"
                className="btn btn-primary mt-6 w-max !rounded-sm"
              >
                Search Staff
              </button>
            </div>
          </div>

          <div className="mx-auto w-full">
            <div>
              <div className="mb-3 ml-[6px] text-[0.875rem]">Results</div>
            </div>
            <table className="table">
              <tbody>
                {staff?.map(
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
                          <IoAdd
                            size={24}
                            className="cursor-pointer rounded-full bg-primary p-[0.3rem] text-primary-content transition-colors duration-300 hover:bg-primary-dark"
                            onClick={() =>
                              handleAddUserToTeam(id, firstName, lastName)
                            }
                          />
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
            {totalPages && totalPages > 1 && (
              <Pagination totalPages={totalPages} />
            )}
          </div>
        </div>

        <BackSubmitButtons loading={loading} setLoading={setLoading} />
      </Form>
      <Outlet />
    </DarkOverlay>
  );
};

export default ModifyTeam;

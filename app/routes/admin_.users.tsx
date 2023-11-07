import { redirect, type LoaderArgs } from "@remix-run/node";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { searchUsers } from "~/models/auth/users.server";
import { placeholderAvatar } from "~/utility/placeholderAvatar";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const searchQuery = {
    firstName: url.searchParams.get("firstName") as string,
    lastName: url.searchParams.get("lastName") as string,
    email: url.searchParams.get("email") as string,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: 10,
  };

  const { users, totalPages } = await searchUsers(searchQuery, true);

  return { users, totalPages };
};

const Users = () => {
  const navigate = useNavigate();
  const { users, totalPages } = useLoaderData() || {};

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Users" addButtonText="Add User" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <BasicInput
              name="firstName"
              label="First Name"
              placeholder="First Name"
              type="text"
            />

            <BasicInput
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              type="text"
            />

            <BasicInput
              name="email"
              label="Email Address"
              placeholder="Email Address"
              type="text"
            />
          </div>

          <div className="flex flex-row justify-end sm:justify-start">
            <button
              type="submit"
              className="btn btn-primary mt-6 w-max !rounded-sm"
            >
              Search
            </button>
          </div>
        </div>

        <div className="divider w-full" />

        <div className="w-full max-w-[80vw] overflow-x-auto">
          <table className="table table-sm my-3">
            <thead className="sticky top-0">
              <tr>
                {currentPage && <th>#</th>}
                <th></th>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Email</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {users?.map(
                (
                  { id, email, avatar, userDetails, isActive }: User,
                  i: number
                ) => {
                  const { firstName, lastName } = userDetails || {};

                  return (
                    <tr
                      className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                      key={id}
                      onClick={() => navigate(`/admin/users/${id}`)}
                    >
                      {currentPage && (
                        <td>{i + 1 + (currentPage - 1) * users?.length}</td>
                      )}
                      <td className="flex items-center justify-center">
                        <div className="avatar mx-[-10px]">
                          <div className="w-8 rounded-full">
                            <img
                              src={avatar?.href || placeholderAvatar.href}
                              alt="user_avatar"
                            />
                          </div>
                        </div>
                      </td>
                      <td>{firstName && capitalizeFirst(firstName)}</td>
                      <td>{lastName && capitalizeFirst(lastName)}</td>
                      <td>{email}</td>
                      <td>
                        {!isActive && (
                          <div className="ml-4 h-3 w-3 rounded-full bg-red-500" />
                        )}
                        {isActive && (
                          <div className="ml-4 h-3 w-3 self-center rounded-full bg-success" />
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default Users;

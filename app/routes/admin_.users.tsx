import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { searchUsers } from "~/models/users.server";
import { placeholderAvatar } from "~/utility/placeholderAvatar";
import { capitalizeFirst } from "~/utility/stringHelpers";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const searchQuery = {
    firstName: url.searchParams.get("firstName") as string,
    lastName: url.searchParams.get("lastName") as string,
    email: url.searchParams.get("email") as string,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: 10,
  };

  const { users, totalPages } = await searchUsers(searchQuery, true);

  return json({ users, totalPages });
};

const Articles = () => {
  const navigate = useNavigate();
  const { users, totalPages } = useLoaderData() as {
    users: User[];
    totalPages: number;
  };

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Users" addButtonText="Add User" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <div className="form-control w-full sm:w-[215px]">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                className="input-bordered input w-full max-w-xs"
              />
            </div>

            <div className="form-control w-full sm:w-[215px]">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="input-bordered input w-full"
              />
            </div>

            <div className="form-control w-full sm:w-[215px]">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                name="email"
                type="text"
                placeholder="Email Address"
                className="input-bordered input w-full"
              />
            </div>
          </div>

          <div className="flex flex-row justify-end sm:justify-start">
            <button type="submit" className="btn-primary btn mt-6 w-max">
              Search
            </button>
          </div>
        </div>

        <div className="divider w-full" />

        <div className="w-full max-w-[80vw] overflow-x-auto">
          <table className="table-sm my-3 table">
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
              {users &&
                users.map(
                  ({ id, email, avatar, userDetails, isActive }: User, i) => {
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
                                src={avatar?.url || placeholderAvatar.url}
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

export default Articles;

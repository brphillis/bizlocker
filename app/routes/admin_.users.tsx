import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
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

  console.log(searchQuery);

  const { users, totalPages } = await searchUsers(searchQuery);

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
    <>
      <Form
        method="GET"
        className="relative mt-3 max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <h1>Manage Users</h1>
        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <div className="form-control w-full max-w-xs">
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

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="input-bordered input w-full max-w-xs"
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                name="email"
                type="text"
                placeholder="Email Address"
                className="input-bordered input w-full max-w-xs"
              />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
              <button type="submit" className="btn-primary btn mt-6 w-max">
                Search
              </button>

              <button
                type="button"
                className="btn-primary btn mt-6 w-max"
                onClick={() => navigate("add")}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="divider w-full" />

        <div className="my-6 flex justify-center">
          <div className="max-h-[55vh] max-w-[98vw] overflow-x-auto rounded-2xl">
            <table className="table w-[720px] rounded-xl">
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
                    (
                      { id, email, avatar, userDetails, isActive }: User,
                      index
                    ) => {
                      const { firstName, lastName } = userDetails || {};

                      return (
                        <tr
                          className="hover cursor-pointer"
                          key={id}
                          onClick={() => navigate(`/admin/users/${id}`)}
                        >
                          {currentPage && (
                            <td>
                              {index + 1 + (currentPage - 1) * users?.length}
                            </td>
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
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </>
  );
};

export default Articles;

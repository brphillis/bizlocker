import Pagination from "~/components/Pagination";
import { UserWithDetails } from "~/models/Users/types";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

import { userSearchLoader } from "./index.server";
const UserSearch = () => {
  const { users, totalPages } = useLoaderData<typeof userSearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Users"
          buttonLabel="Add User"
          buttonLink="/admin/upsert/user?contentId=add"
        />

        <AdminContentSearch firstName={true} lastName={true} email={true} />

        <div className="divider w-full" />

        {users && users.length > 0 && (
          <BasicTable
            onRowClick={(id) => navigate(`/admin/upsert/user?contentId=${id}`)}
            currentPage={currentPage}
            objectArray={users?.map((e: UserWithDetails) => ({
              id: e.id,
              firstName: e.userDetails?.firstName,
              lastName: e.userDetails?.lastName,
              email: e.email,
              active: e.isActive,
            }))}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default UserSearch;

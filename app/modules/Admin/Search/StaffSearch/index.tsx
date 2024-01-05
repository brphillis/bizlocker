import { json } from "@remix-run/node";
import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import { searchStaff, type StaffWithDetails } from "~/models/staff.server";
import {
  Form,
  Outlet,
  type Params,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

export const staffSearchLoader = async (
  request: Request,
  params: Params<string>
) => {
  const url = new URL(request.url);

  const searchQuery = {
    firstName: url.searchParams.get("firstName") as string,
    lastName: url.searchParams.get("lastName") as string,
    email: url.searchParams.get("email") as string,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: 10,
  };

  const { staff, totalPages } = await searchStaff(searchQuery, true);

  return json({ staff, totalPages });
};

const StaffSearch = () => {
  const { staff, totalPages } = useLoaderData<typeof staffSearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Staff"
          buttonLabel="Add Staff"
          buttonLink="/admin/upsert/staff?contentId=add"
        />

        <AdminContentSearch firstName={true} lastName={true} email={true} />

        <div className="divider w-full" />

        {staff && staff.length > 0 && (
          <BasicTable
            onRowClick={(id) => navigate(`/admin/upsert/staff?contentId=${id}`)}
            currentPage={currentPage}
            objectArray={staff?.map((e: StaffWithDetails) => ({
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

export default StaffSearch;

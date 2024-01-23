import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import { StaffWithDetails } from "~/models/Staff/types";
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
import { staffSearchLoader } from "./index.server";

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

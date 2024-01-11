import Pagination from "~/components/Pagination";
import type { Department } from "@prisma/client";
import BasicTable from "~/components/Tables/BasicTable";
import CategorySort from "~/components/Sorting/CategorySort";
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
import type { departmentSearchLoader } from "./index.server";

const DepartmentSearch = () => {
  const { totalPages, departments } =
    useLoaderData<typeof departmentSearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form
        method="GET"
        className="relative h-full w-full rounded-none bg-base-200 p-6"
      >
        <AdminPageHeader
          title="Manage Departments"
          buttonLabel="Add Promotion"
          buttonLink="/admin/upsert/department?contentId=add"
        />

        <AdminContentSearch name={true} />

        <div className="divider w-full" />

        <CategorySort />

        {departments && departments.length > 0 && (
          <BasicTable
            onRowClick={(id) =>
              navigate(`/admin/upsert/department?contentId=${id}`)
            }
            currentPage={currentPage}
            objectArray={departments?.map((e: Department) => ({
              id: e.id,
              name: e.name,
              index: e.index,
              navigation: e.displayInNavigation,
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

export default DepartmentSearch;

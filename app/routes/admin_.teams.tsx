import { tokenAuth } from "~/auth.server";
import Pagination from "~/components/Pagination";
import { STAFF_SESSION_KEY } from "~/session.server";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { searchTeams, type TeamWithStaff } from "~/models/teams.server";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const { teams, totalPages } = await searchTeams(undefined, url);

  return json({
    teams,
    totalPages,
  });
};

const ManageTeams = () => {
  const { teams, totalPages } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const currentPage: number = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Teams"
          buttonLabel="Add Team"
          buttonLink="/admin/upsert/team?contentId=add"
        />

        <AdminContentSearch name={true} />

        <div className="divider w-full" />

        {teams && teams.length > 0 && (
          <BasicTable
            onRowClick={(id) =>
              navigate({
                pathname: "/admin/upsert/team",
                search: `?contentId=${id}`,
              })
            }
            currentPage={currentPage}
            objectArray={teams?.map((e: TeamWithStaff) => ({
              id: e.id,
              name: e.name,
              store: e.store?.name,
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

export default ManageTeams;

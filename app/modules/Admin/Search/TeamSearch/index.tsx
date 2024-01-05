import { json } from "@remix-run/node";
import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import { searchTeams, type TeamWithStaff } from "~/models/teams.server";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import {
  Form,
  Outlet,
  type Params,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

export const teamSearchLoader = async (
  request: Request,
  params: Params<string>
) => {
  const url = new URL(request.url);

  const { teams, totalPages } = await searchTeams(undefined, url);

  return json({
    teams,
    totalPages,
  });
};

const TeamSearch = () => {
  const { teams, totalPages } = useLoaderData<typeof teamSearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const currentPage: number = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Teams"
          buttonLabel="Add Team"
          buttonLink="/admin/upsert/team?teamId=add"
        />

        <AdminContentSearch name={true} />

        <div className="divider w-full" />

        {teams && teams.length > 0 && (
          <BasicTable
            onRowClick={(id) =>
              navigate({
                pathname: "/admin/upsert/team",
                search: `?teamId=${id}`,
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

export default TeamSearch;

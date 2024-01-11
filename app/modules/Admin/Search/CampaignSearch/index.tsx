import type { Campaign } from "@prisma/client";
import Pagination from "~/components/Pagination";
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
import type { campaignSearchLoader } from "./index.server";

const CampaignSearch = () => {
  const { campaigns, totalPages } =
    useLoaderData<typeof campaignSearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Campaign"
          buttonLabel="Add Campaign"
          buttonLink="/admin/upsert/campaign?contentId=add"
        />

        <AdminContentSearch name={true} />

        <div className="divider w-full" />

        {campaigns && campaigns.length > 0 && (
          <BasicTable
            onRowClick={(id) =>
              navigate(`/admin/upsert/campaign?contentId=${id}`)
            }
            currentPage={currentPage}
            objectArray={campaigns?.map((e: Campaign) => ({
              id: e.id,
              name: e.name,
              created: e.createdAt,
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

export default CampaignSearch;

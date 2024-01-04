import type { Campaign } from "@prisma/client";
import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import BasicTable from "~/components/Tables/BasicTable";
import { searchCampaigns } from "~/models/campaigns.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/login");
  }

  const url = new URL(request.url);

  const { campaigns, totalPages } = await searchCampaigns(undefined, url);

  return json({ campaigns, totalPages });
};

const Campaigns = () => {
  const { campaigns, totalPages } = useLoaderData<typeof loader>();

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

export default Campaigns;

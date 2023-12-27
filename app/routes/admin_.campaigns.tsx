import type { Campaign } from "@prisma/client";
import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
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

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Campaign" addButtonText="Add Campaign" />

        <div className="mt-3 flex flex-col">
          <BasicInput label="Name" name="name" placeholder="Name" type="text" />

          <div className="flex flex-row justify-end sm:justify-start">
            <button
              type="submit"
              className="btn btn-primary mt-6 w-max !rounded-sm"
            >
              Search
            </button>
          </div>
        </div>

        <div className="divider w-full" />

        {campaigns && campaigns.length > 0 && (
          <BasicTable
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

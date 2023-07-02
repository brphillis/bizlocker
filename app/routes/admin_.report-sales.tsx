import type { LoaderArgs } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import { getSalesToday } from "~/models/saleReports.server";

export const loader = async ({ request }: LoaderArgs) => {
  const salesToday = await getSalesToday();

  return { salesToday };
};

const ManageHomePage = () => {
  const { salesToday } = useLoaderData() as { salesToday: number };

  console.log(salesToday);

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-300 p-6">
        <AdminPageHeader title="Sales Reports" />
        <div className="flex justify-center bg-base-100">
          <div className="stats rounded-none shadow">
            <div className="stat place-items-center">
              <div className="stat-title">Sales 24hr</div>
              <div className="stat-value">${salesToday.toFixed(2)}</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Items Sold</div>
              <div className="stat-value text-primary">1</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Profit</div>
              <div className="stat-value">$8.19</div>
            </div>
          </div>
        </div>
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageHomePage;

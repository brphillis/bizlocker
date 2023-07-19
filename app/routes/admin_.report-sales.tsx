import type { LoaderArgs } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import PieReChart from "~/components/Charts/PieChart";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import { getSalesToday } from "~/models/saleReports.server";
import { calculatePercentageChange } from "~/utility/numberHelpers";

type ReportData = {
  productCategory: string;
  brand: string;
  totalSales: number;
  totalSalesYesterday: number;
};

export const loader = async ({ request }: LoaderArgs) => {
  const {
    totalSalesToday,
    totalSalesYesterday,
    productCountToday,
    topProductCategoriesToday,
    topBrandsToday,
  } = await getSalesToday();

  return {
    totalSalesToday,
    totalSalesYesterday,
    productCountToday,
    topProductCategoriesToday,
    topBrandsToday,
  };
};

const ManageHomePage = () => {
  const {
    totalSalesToday,
    totalSalesYesterday,
    productCountToday,
    topProductCategoriesToday,
    topBrandsToday,
  } =
    (useLoaderData() as {
      totalSalesToday: number;
      totalSalesYesterday: number;
      productCountToday: number;
      topProductCategoriesToday: ReportData[];
      topBrandsToday: ReportData[];
    }) || {};

  let categoryPieData = topProductCategoriesToday
    .filter((item: any) => item.totalSales !== 0)
    .map((item: ReportData) => ({
      name: item.productCategory,
      value: item.totalSales,
    }));

  let brandPieData = topBrandsToday
    .filter((item: any) => item.totalSales !== 0)
    .map((item: any) => ({
      name: item.brand,
      value: item.totalSales,
    }));

  return (
    <AdminPageWrapper>
      <Form
        method="GET"
        className="max-w-screen relative h-max w-full bg-base-200 p-6"
      >
        <AdminPageHeader title="Sales Reports" />
        <div className="flex justify-center pb-6 text-3xl">
          <h1 className="tracking wider font-bold">Sales Statistics - Today</h1>
        </div>
        <div className="flex justify-center bg-base-100 px-3 py-3">
          <div className="stats rounded-none">
            <div className="stat place-items-center">
              <div className="stat-title">Sales</div>
              <div className="stat-value">${totalSalesToday?.toFixed(2)}</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Items Sold</div>
              <div className="stat-value text-primary">{productCountToday}</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">From Yesterday</div>
              <div className="stat-value">
                {calculatePercentageChange(
                  totalSalesToday,
                  totalSalesYesterday
                )?.toFixed(0) + "%"}
              </div>
            </div>
          </div>
        </div>

        <div className="divider w-full" />

        <div className="flex h-max w-full flex-row flex-wrap items-center justify-center">
          <div className="flex w-full flex-col items-center sm:w-1/2">
            <h1 className="mb-3 text-xl font-bold">Top 10 Category Sales</h1>
            <PieReChart data={categoryPieData} />
          </div>

          <div className="divider divider-horizontal !m-0 hidden !w-0 !p-0 sm:flex" />

          <div className="divider flex w-full sm:hidden" />

          <div className="flex w-full flex-col  items-center sm:w-1/2">
            <h1 className="mb-3 text-xl font-bold">Top 10 Brand Sales</h1>
            <PieReChart data={brandPieData} />
          </div>
        </div>

        <div className="divider w-full" />

        <button className="btn-primary btn-md mx-auto mt-6 block self-start">
          Generate PDF
        </button>
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageHomePage;

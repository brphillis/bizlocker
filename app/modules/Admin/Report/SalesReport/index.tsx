import { Form, Outlet, useLoaderData } from "@remix-run/react";
import PieReChart from "~/components/Charts/PieChart";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import { calculatePercentageChange } from "~/helpers/numberHelpers";
import WindowContainer from "~/components/Layout/Containers/WindowContainer";
import BasicButton from "~/components/Buttons/BasicButton";
import type { salesReportLoader } from "./index.server";

type ReportData = {
  productSubCategory?: string | null;
  brand?: string | null;
  totalSales?: number | null;
  totalSalesYesterday?: number | null;
};

const SalesReporting = () => {
  const {
    totalSalesToday,
    totalSalesYesterday,
    productCountToday,
    topProductSubCategoriesToday,
    topBrandsToday,
  } = useLoaderData<typeof salesReportLoader>();

  const categoryPieData = topProductSubCategoriesToday
    ?.filter(
      (item: {
        productSubCategory?: string | null | undefined;
        totalSales?: number | null | undefined;
      }) => item.totalSales !== 0,
    )
    .map((item: ReportData) => ({
      name: item?.productSubCategory as string,
      value: item?.totalSales as number,
    }));

  const brandPieData = topBrandsToday
    ?.filter(
      (item: {
        brand?: string | null | undefined;
        totalSales?: number | null | undefined;
      }) => item.totalSales !== 0,
    )
    .map(
      (item: {
        brand?: string | null | undefined;
        totalSales?: number | null | undefined;
      }) => ({
        name: item.brand,
        value: item.totalSales,
      }),
    );

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-max min-h-full w-full p-6">
        <AdminPageHeader title="Sales Reports" />

        <div className="flex flex-col gap-3">
          <WindowContainer
            title="Sales Today"
            extendStyle="bg-base-200"
            extendTitleBarStyle="!bg-base-500"
            hideClose={true}
          >
            <div className="stats rounded-none bg-base-200">
              <div className="stat place-items-center">
                <div className="stat-title">Sales</div>
                <div className="stat-value">${totalSalesToday?.toFixed(2)}</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Items Sold</div>
                <div className="stat-value text-primary">
                  {productCountToday}
                </div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">From Yesterday</div>
                <div className="stat-value">
                  {totalSalesToday && totalSalesYesterday
                    ? calculatePercentageChange(
                        totalSalesToday,
                        totalSalesYesterday,
                      )?.toFixed(0) + "%"
                    : "No Stats"}
                </div>
              </div>
            </div>
          </WindowContainer>

          <WindowContainer
            title="Charts"
            extendStyle="bg-base-200"
            extendTitleBarStyle="!bg-base-500"
            hideClose={true}
          >
            <div className="flex h-max w-full flex-row flex-wrap items-center justify-center">
              <div className="flex w-full flex-col items-center sm:w-1/2">
                <h1 className="mb-3 text-xl font-bold">
                  Top 10 Category Sales
                </h1>
                {categoryPieData && <PieReChart data={categoryPieData} />}
              </div>

              <div className="divider divider-horizontal !m-0 hidden !w-0 !p-0 sm:flex" />

              <div className="divider flex w-full sm:hidden" />

              <div className="flex w-full flex-col  items-center sm:w-1/2">
                <h1 className="mb-3 text-xl font-bold">Top 10 Brand Sales</h1>
                {brandPieData && (
                  <PieReChart
                    data={brandPieData as { name: string; value: number }[]}
                  />
                )}
              </div>
            </div>
          </WindowContainer>

          <WindowContainer
            title="Generate Reports"
            extendStyle="bg-base-200"
            extendTitleBarStyle="!bg-base-500"
            hideClose={true}
          >
            <div>
              <BasicButton label="Generate PDF" />
            </div>
          </WindowContainer>
        </div>
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default SalesReporting;

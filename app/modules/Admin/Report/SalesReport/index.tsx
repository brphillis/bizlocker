import { Form, Outlet, type Params, useLoaderData } from "@remix-run/react";
import PieReChart from "~/components/Charts/PieChart";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import { getSalesToday } from "~/models/saleReports.server";
import { calculatePercentageChange } from "~/helpers/numberHelpers";
import WindowContainer from "~/components/Layout/Containers/WindowContainer";
import BasicButton from "~/components/Buttons/BasicButton";

type ReportData = {
  productSubCategory?: string | null;
  brand?: string | null;
  totalSales?: number | null;
  totalSalesYesterday?: number | null;
};

export const salesReportLoader = async (
  request: Request,
  params: Params<string>
) => {
  const {
    totalSalesToday,
    totalSalesYesterday,
    productCountToday,
    topProductSubCategoriesToday,
    topBrandsToday,
  } = await getSalesToday();

  return {
    totalSalesToday,
    totalSalesYesterday,
    productCountToday,
    topProductSubCategoriesToday,
    topBrandsToday,
  };
};

const SalesReporting = () => {
  const {
    totalSalesToday,
    totalSalesYesterday,
    productCountToday,
    topProductSubCategoriesToday,
    topBrandsToday,
  } = useLoaderData<typeof salesReportLoader>();

  let categoryPieData = topProductSubCategoriesToday
    ?.filter((item: any) => item.totalSales !== 0)
    .map((item: ReportData) => ({
      name: item?.productSubCategory as string,
      value: item?.totalSales as number,
    }));

  let brandPieData = topBrandsToday
    ?.filter((item: any) => item.totalSales !== 0)
    .map((item: any) => ({
      name: item.brand,
      value: item.totalSales,
    }));

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-max min-h-full w-full p-6">
        <AdminPageHeader title="Sales Reports" />

        <div className="flex flex-col gap-3">
          <WindowContainer
            label="Sales Today"
            direction="col"
            extendStyle="bg-base-200"
            children={
              <div className="stats rounded-none bg-base-200">
                <div className="stat place-items-center">
                  <div className="stat-title">Sales</div>
                  <div className="stat-value">
                    ${totalSalesToday?.toFixed(2)}
                  </div>
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
                          totalSalesYesterday
                        )?.toFixed(0) + "%"
                      : "No Stats"}
                  </div>
                </div>
              </div>
            }
          />

          <WindowContainer
            label="Charts"
            direction="col"
            extendStyle="bg-base-200"
            children={
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
                  {brandPieData && <PieReChart data={brandPieData} />}
                </div>
              </div>
            }
          />

          <WindowContainer
            label="Generate Reports"
            direction="col"
            extendStyle="bg-base-200"
            children={
              <>
                <div>
                  <BasicButton label="Generate PDF" />
                </div>
              </>
            }
          />
        </div>
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default SalesReporting;

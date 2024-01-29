import { getSalesToday } from "~/models/SalesReports/index.server";

export const salesReportLoader = async () => {
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

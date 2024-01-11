import type { Params } from "@remix-run/react";
import { getSalesToday } from "~/models/saleReports.server";

export const salesReportLoader = async (
  request: Request,
  params: Params<string>,
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
